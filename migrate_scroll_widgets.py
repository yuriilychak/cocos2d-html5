#!/usr/bin/env python3
"""Migrate 5 scroll widget files from ES5 .extend() to ES6 class syntax."""
import re
import sys

def migrate_file(filepath, class_name, parent_expr, super_prototype_patterns):
    """
    Migrate a single file from ES5 .extend({...}) to ES6 class syntax.
    
    Args:
        filepath: Path to the file
        class_name: e.g. "ScrollView"
        parent_expr: e.g. "ccui.Layout" - what appears in extends clause
        super_prototype_patterns: list of regex patterns for super calls, 
            e.g. ["ccui.Layout.prototype"]
    """
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Step 1: Find the extend block boundaries
    # Pattern: ccui.ClassName = ccui.Parent.extend(/** @lends ... */{
    # or:      ccui.ClassName = ccui.Parent.extend({
    extend_pattern = re.compile(
        r'(ccui\.' + re.escape(class_name) + r'\s*=\s*)'
        r'ccui\.\w+\.extend\s*\('
        r'(?:/\*\*\s*@lends\s+[^*]*\*/\s*)?'
        r'\{'
    )
    
    match = extend_pattern.search(content)
    if not match:
        print(f"  ERROR: Could not find .extend( pattern in {filepath}")
        return False
    
    # Find the closing });  for the extend call
    # We need to find the matching closing brace for the opening { 
    start_of_body = match.end() - 1  # position of the opening {
    
    # Find matching closing brace
    brace_count = 1
    pos = start_of_body + 1
    while pos < len(content) and brace_count > 0:
        if content[pos] == '{':
            brace_count += 1
        elif content[pos] == '}':
            brace_count -= 1
        pos += 1
    
    # pos is now right after the closing }
    closing_brace_pos = pos - 1
    
    # After closing brace should be ");", possibly with whitespace
    rest_after_brace = content[closing_brace_pos + 1:]
    close_match = re.match(r'\s*\)', rest_after_brace)
    if not close_match:
        print(f"  ERROR: Could not find closing ); after class body in {filepath}")
        return False
    
    end_of_extend = closing_brace_pos + 1 + close_match.end()
    
    # Extract the class body (between the braces)
    class_body = content[start_of_body + 1:closing_brace_pos]
    
    # Step 2: Transform the class body
    # 2a: Convert property declarations at class level (like _innerContainer: null,)
    #     These become instance properties in the constructor or stay as-is for ES5 compat
    #     Actually in the extend pattern, these are prototype properties. We keep them as-is
    #     since the original code has them and they work fine as class field-like syntax.
    #     Wait - ES6 class bodies can't have property: value, syntax. We need to keep them
    #     but they were originally prototype properties set by the extend() mechanism.
    #     For compatibility, we'll keep them as-is since this is a custom class system.
    #     Actually NO - in ES6 class syntax, you can't have `_foo: null,` as a statement.
    #     These need to stay as class fields or be moved to constructor.
    #     
    #     Looking at the migration rules more carefully - the user wants us to keep the
    #     property declarations as they are. In modern ES6+, class fields are supported.
    #     But the cocos2d class system used these as prototype properties.
    #     
    #     Actually, looking at the existing migrated files in the codebase, let me check
    #     what convention they use...
    #     
    #     The rules say: Convert methodName: function(...) to methodName(...) 
    #     For non-method properties like `_direction: null,` these should remain as-is
    #     because they're class fields in ES2022+ syntax.
    #     But wait, class fields use `=` not `:`. We need `_direction = null;`
    
    # Let me convert property declarations: `_prop: value,` -> `_prop = value;`
    # But only for simple property declarations, not methods
    
    # 2b: Convert ctor to constructor
    # 2c: Convert methods
    # 2d: Convert super calls
    
    lines = class_body.split('\n')
    result_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Skip /** @lends */ comments (already handled in the extend pattern, but just in case)
        if re.match(r'\s*/\*\*\s*@lends', line):
            # Skip until */
            while i < len(lines) and '*/' not in lines[i]:
                i += 1
            i += 1
            continue
        
        # Check if this is a method definition: `methodName: function(...) {`
        # or `ctor: function(...) {`
        method_match = re.match(r'^(\s*)(ctor|[\w]+)\s*:\s*function\s*\(([^)]*)\)\s*\{', line)
        
        if method_match:
            indent = method_match.group(1)
            method_name = method_match.group(2)
            params = method_match.group(3)
            
            if method_name == 'ctor':
                result_lines.append(f'{indent}constructor({params}) {{')
            else:
                result_lines.append(f'{indent}{method_name}({params}) {{')
            i += 1
            continue
        
        # Check for property declarations: `_prop: value,` (not a method)
        # These are lines like: `_innerContainer: null,`
        # or: `bounceEnabled: false,`
        # They should become class fields: `_innerContainer = null;`
        prop_match = re.match(r'^(\s+)([\w]+)\s*:\s*(.+?)\s*,?\s*$', line)
        if prop_match and not re.match(r'^(\s+)[\w]+\s*:\s*function\s*\(', line):
            # Check if the value looks like a simple value (not a method)
            value = prop_match.group(3)
            # Strip trailing comma
            value = value.rstrip(',').rstrip()
            
            # Only convert if it's a simple value (null, number, string, boolean, array literal, etc.)
            # Not if it's a complex expression that looks like a method body
            if re.match(r'^(null|true|false|undefined|-?\d+\.?\d*|"[^"]*"|\'[^\']*\'|\[\]|\{\}|0|1|0\.0|1\.0|ccui\.\w+(\.\w+)*|cc\.\w+(\.\w+)*)$', value):
                indent = prop_match.group(1)
                prop_name = prop_match.group(2)
                result_lines.append(f'{indent}{prop_name} = {value};')
                i += 1
                continue
        
        # Convert super calls in the line
        transformed_line = line
        for pattern in super_prototype_patterns:
            # Pattern: SomeClass.prototype.ctor.call(this) -> super()
            # or: SomeClass.prototype.ctor.call(this, args) -> super(args)
            transformed_line = re.sub(
                re.escape(pattern) + r'\.ctor\.call\(this\)',
                'super()',
                transformed_line
            )
            transformed_line = re.sub(
                re.escape(pattern) + r'\.ctor\.call\(this,\s*',
                'super(',
                transformed_line
            )
            
            # Pattern: SomeClass.prototype.methodName.call(this) -> super.methodName()
            transformed_line = re.sub(
                re.escape(pattern) + r'\.(\w+)\.call\(this\)',
                r'super.\1()',
                transformed_line
            )
            # Pattern: SomeClass.prototype.methodName.call(this, args) -> super.methodName(args)
            transformed_line = re.sub(
                re.escape(pattern) + r'\.(\w+)\.call\(this,\s*',
                r'super.\1(',
                transformed_line
            )
        
        result_lines.append(transformed_line)
        i += 1
    
    # Now join the body back
    new_body = '\n'.join(result_lines)
    
    # Remove trailing commas after method closing braces
    # Pattern: }  ,  (with possible whitespace and newline before next method or end)
    # We need to remove commas that appear after } at the end of methods
    # In ES5: `}, \n\n    nextMethod: function` 
    # In ES6: `} \n\n    nextMethod(`
    new_body = re.sub(r'\},(\s*\n)', r'}\1', new_body)
    
    # Build the new content
    # Before the extend: everything up to the match start
    before = content[:match.start()]
    after_extend = content[end_of_extend:]
    
    # Check if after_extend starts with ;
    if after_extend.startswith(';'):
        after_extend = after_extend[1:]  # remove existing semicolon, we'll add our own
    
    # Build new class declaration
    new_class = f'ccui.{class_name} = class {class_name} extends {parent_expr} {{'
    new_content = before + new_class + new_body + '};\n' + after_extend.lstrip('\n')
    
    # Fix: ensure there's no double newline issue at the class closing
    # The closing should be `};` not `})`
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    
    print(f"  Migrated {filepath}")
    return True


def main():
    base = '/home/yurii/Projects/cocos2d-html5/extensions/ccui/uiwidgets/scroll-widget'
    
    files = [
        {
            'path': f'{base}/UIScrollView.js',
            'class_name': 'ScrollView',
            'parent_expr': 'ccui.Layout',
            'super_patterns': ['ccui.Layout.prototype'],
        },
        {
            'path': f'{base}/UIScrollViewBar.js',
            'class_name': 'ScrollViewBar',
            'parent_expr': 'ccui.ProtectedNode',
            'super_patterns': ['cc.ProtectedNode.prototype', 'ccui.ScrollViewBar.prototype'],
        },
        {
            'path': f'{base}/UIListView.js',
            'class_name': 'ListView',
            'parent_expr': 'ccui.ScrollView',
            'super_patterns': ['ccui.ScrollView.prototype'],
        },
        {
            'path': f'{base}/UIPageView.js',
            'class_name': 'PageView',
            'parent_expr': 'ccui.ListView',
            'super_patterns': ['ccui.ListView.prototype', 'ccui.ScrollView.prototype'],
        },
        {
            'path': f'{base}/UIPageViewIndicator.js',
            'class_name': 'PageViewIndicator',
            'parent_expr': 'ccui.ProtectedNode',
            'super_patterns': ['cc.ProtectedNode.prototype'],
        },
    ]
    
    for f in files:
        print(f"Processing {f['class_name']}...")
        migrate_file(f['path'], f['class_name'], f['parent_expr'], f['super_patterns'])


if __name__ == '__main__':
    main()
