import { Director, Scene } from "@aspect/core";

// Test function definition
export function runSocketIOTest() {
    console.log('SocketIOTest executed');
    Director.getInstance().runScene(new Scene());
};

