# Real-Time Collaborative Drawing App

This is a simple real-time collaborative drawing application. Users can draw colorful lines on a shared canvas and see the drawings of other users in real time. The application also includes tools for erasing lines and changing colors.

## Features

- Real-time collaborative drawing
- Eraser tool for removing lines
- Pen tool with adjustable size
- Color selection (purple, green, red, gold, blue)
- Canvas state persistence (new users see the current state of the canvas)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/realtime-drawing-app.git
    cd realtime-drawing-app
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the server:

    ```sh
    npm start
    ```

4. Open your browser and go to `http://localhost:3000`.

## Usage

- **Pen Tool**: The default tool for drawing. Adjust the size using the size slider.
- **Eraser Tool**: Remove lines by selecting the eraser tool and adjusting the size.
- **Color Selection**: Choose from purple, green, red, gold, and blue.

### Toolbar

The toolbar is located at the top right corner of the canvas and includes the following:

- **Pen Button**: Selects the pen tool for drawing.
- **Eraser Button**: Selects the eraser tool for removing lines.
- **Size Sliders**: Adjust the size of the pen and eraser tools.
- **Color Buttons**: Select the color for the pen tool.

## Code Overview

### Server (`server.js`)

The server is built with Node.js and Socket.io. It handles real-time communication between clients and maintains the state of the canvas.

- **Dependencies**: `express`, `http`, `socket.io`
- **Main Functionality**:
  - Store the canvas state
  - Send the current canvas state to new users
  - Broadcast drawing and erasing events to all connected clients

### Client (`public/script.js`)

The client-side code is responsible for drawing on the canvas and communicating with the server using Socket.io.

- **Canvas Setup**: Handles drawing and erasing on the canvas based on user input
- **Socket Communication**: Sends and receives drawing and erasing events to/from the server
- **Toolbar**: Provides tools for selecting pen/eraser, adjusting size, and changing colors

## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

This application uses the following open-source libraries:

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)

