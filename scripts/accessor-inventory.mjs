#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SCAN_DIRS = ["apps", "packages"];
const TOP_LIMIT = 30;

const LEGACY_DEFINITION_RE = /^\s*(?:async\s+)?(?<name>(?:get|set|is)[A-Z][A-Za-z0-9_$]*)\s*\([^)]*\)\s*\{/;
const ACCESSOR_DEFINITION_RE = /^\s*(?<kind>get|set)\s+(?<name>[A-Za-z_$][A-Za-z0-9_$]*)\s*\([^)]*\)\s*\{/;
const LEGACY_CALL_RE = /\.(?<name>(?:get|set|is)[A-Z][A-Za-z0-9_$]*)\s*\(/g;

function walkJsFiles(dir) {
  const files = [];

  function visit(currentDir) {
    for (const entry of readdirSync(currentDir)) {
      if (entry === "node_modules" || entry === "dist" || entry === "dist-desktop") {
        continue;
      }

      const fullPath = path.join(currentDir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        visit(fullPath);
      } else if (entry.endsWith(".js") || entry.endsWith(".mjs")) {
        files.push(fullPath);
      }
    }
  }

  visit(dir);
  return files;
}

function packageName(filePath) {
  const relative = path.relative(ROOT_DIR, filePath);
  const parts = relative.split(path.sep);
  return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : parts[0];
}

function propertyName(methodName) {
  const prefix = methodName.startsWith("is") ? "is" : methodName.startsWith("get") ? "get" : "set";
  const raw = methodName.slice(prefix.length);
  return raw ? raw[0].toLowerCase() + raw.slice(1) : methodName;
}

function addCount(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function addNestedCount(map, group, key) {
  if (!map.has(group)) map.set(group, new Map());
  addCount(map.get(group), key);
}

function sortedEntries(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

function topEntries(map, limit = TOP_LIMIT) {
  return sortedEntries(map).slice(0, limit);
}

function classifyCall(methodName) {
  if (/^(get|set)(Child|Action|Texture|Uniform|Attribute|Element|Res|Instance|CurrentTarget|ControlPointAt|Title.*ForState|Background.*ForState)/.test(methodName)) {
    return "query-or-command";
  }

  if (/^set(Position|ContentSize|AnchorPoint|Color|BlendFunc|CapInsets|Margin|Font|VirtualViewport)$/.test(methodName)) {
    return "multi-arg-or-overloaded";
  }

  if (/^(get|set|is)(PositionX|PositionY|Scale|ScaleX|ScaleY|Rotation|RotationX|RotationY|Opacity|Color|Visible|Parent|Children|ChildrenCount|Name|Enabled|String|Texture|Tag|ActionTag|TouchEnabled)$/.test(methodName)) {
    return "simple-property-candidate";
  }

  return "needs-review";
}

function analyzeFile(filePath, inventory) {
  const pkg = packageName(filePath);
  const relative = path.relative(ROOT_DIR, filePath);
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const legacyDefinition = line.match(LEGACY_DEFINITION_RE);
    if (legacyDefinition && !line.includes(`${legacyDefinition.groups.name}(function`)) {
      const name = legacyDefinition.groups.name;
      const prop = propertyName(name);
      const classification = classifyCall(name);
      addCount(inventory.legacyDefinitions.totalByName, name);
      addCount(inventory.legacyDefinitions.totalByPackage, pkg);
      addNestedCount(inventory.legacyDefinitions.byPackageAndName, pkg, name);
      inventory.legacyDefinitions.items.push({ file: relative, line: lineNumber, name, prop, classification });
    }

    const accessorDefinition = line.match(ACCESSOR_DEFINITION_RE);
    if (accessorDefinition) {
      const { kind, name } = accessorDefinition.groups;
      addCount(inventory.accessorDefinitions.totalByName, `${kind} ${name}`);
      addCount(inventory.accessorDefinitions.totalByPackage, pkg);
      addNestedCount(inventory.accessorDefinitions.byPackageAndName, pkg, `${kind} ${name}`);
      inventory.accessorDefinitions.properties.add(name);
      inventory.accessorDefinitions.items.push({ file: relative, line: lineNumber, kind, name });
    }

    for (const call of line.matchAll(LEGACY_CALL_RE)) {
      const name = call.groups.name;
      const prop = propertyName(name);
      const classification = classifyCall(name);
      addCount(inventory.callSites.totalByName, name);
      addCount(inventory.callSites.totalByPackage, pkg);
      addCount(inventory.callSites.totalByClassification, classification);
      addNestedCount(inventory.callSites.byPackageAndName, pkg, name);
      inventory.callSites.items.push({ file: relative, line: lineNumber, name, prop, classification });
    }
  });
}

function makeInventory() {
  const inventory = {
    filesScanned: 0,
    legacyDefinitions: {
      items: [],
      totalByName: new Map(),
      totalByPackage: new Map(),
      byPackageAndName: new Map(),
    },
    accessorDefinitions: {
      items: [],
      properties: new Set(),
      totalByName: new Map(),
      totalByPackage: new Map(),
      byPackageAndName: new Map(),
    },
    callSites: {
      items: [],
      totalByName: new Map(),
      totalByPackage: new Map(),
      totalByClassification: new Map(),
      byPackageAndName: new Map(),
    },
  };

  for (const dir of SCAN_DIRS) {
    const absoluteDir = path.join(ROOT_DIR, dir);
    for (const filePath of walkJsFiles(absoluteDir)) {
      inventory.filesScanned += 1;
      analyzeFile(filePath, inventory);
    }
  }

  return inventory;
}

function serializableMap(map, limit = undefined) {
  const entries = limit ? topEntries(map, limit) : sortedEntries(map);
  return Object.fromEntries(entries);
}

function toJson(inventory) {
  const accessorProperties = inventory.accessorDefinitions.properties;
  const unmappedDefinitions = inventory.legacyDefinitions.items.filter((item) => !accessorProperties.has(item.prop));
  const unmappedCallSites = inventory.callSites.items.filter((item) => !accessorProperties.has(item.prop));

  return {
    filesScanned: inventory.filesScanned,
    totals: {
      legacyDefinitions: inventory.legacyDefinitions.items.length,
      accessorDefinitions: inventory.accessorDefinitions.items.length,
      legacyCallSites: inventory.callSites.items.length,
      unmappedDefinitions: unmappedDefinitions.length,
      unmappedCallSites: unmappedCallSites.length,
    },
    legacyDefinitionsByPackage: serializableMap(inventory.legacyDefinitions.totalByPackage),
    accessorDefinitionsByPackage: serializableMap(inventory.accessorDefinitions.totalByPackage),
    callSitesByPackage: serializableMap(inventory.callSites.totalByPackage),
    callSitesByClassification: serializableMap(inventory.callSites.totalByClassification),
    topLegacyDefinitions: serializableMap(inventory.legacyDefinitions.totalByName, TOP_LIMIT),
    topAccessorDefinitions: serializableMap(inventory.accessorDefinitions.totalByName, TOP_LIMIT),
    topCallSites: serializableMap(inventory.callSites.totalByName, TOP_LIMIT),
    topUnmappedDefinitions: serializableMap(countByName(unmappedDefinitions), TOP_LIMIT),
    topUnmappedCallSites: serializableMap(countByName(unmappedCallSites), TOP_LIMIT),
  };
}

function countByName(items) {
  const counts = new Map();
  for (const item of items) addCount(counts, item.name);
  return counts;
}

function printTable(title, entries) {
  console.log(`\n${title}`);
  if (entries.length === 0) {
    console.log("  none");
    return;
  }

  for (const [name, count] of entries) {
    console.log(`${String(count).padStart(6)}  ${name}`);
  }
}

function printText(inventory) {
  const json = toJson(inventory);

  console.log("Accessor migration inventory");
  console.log(`Files scanned: ${json.filesScanned}`);
  console.log(`Legacy method definitions: ${json.totals.legacyDefinitions}`);
  console.log(`ES accessor definitions: ${json.totals.accessorDefinitions}`);
  console.log(`Legacy call sites: ${json.totals.legacyCallSites}`);
  console.log(`Unmapped legacy definitions: ${json.totals.unmappedDefinitions}`);
  console.log(`Unmapped legacy call sites: ${json.totals.unmappedCallSites}`);

  printTable("Legacy definitions by package", Object.entries(json.legacyDefinitionsByPackage));
  printTable("ES accessors by package", Object.entries(json.accessorDefinitionsByPackage));
  printTable("Legacy call sites by package", Object.entries(json.callSitesByPackage));
  printTable("Legacy call sites by classification", Object.entries(json.callSitesByClassification));
  printTable("Top legacy method definitions", Object.entries(json.topLegacyDefinitions));
  printTable("Top ES accessor definitions", Object.entries(json.topAccessorDefinitions));
  printTable("Top legacy call sites", Object.entries(json.topCallSites));
  printTable("Top unmapped legacy definitions", Object.entries(json.topUnmappedDefinitions));
  printTable("Top unmapped legacy call sites", Object.entries(json.topUnmappedCallSites));
}

const inventory = makeInventory();

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(toJson(inventory), null, 2));
} else {
  printText(inventory);
}
