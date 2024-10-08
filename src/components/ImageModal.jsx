import React, { useRef, useState, useEffect } from 'react';

const ImageModal = ({ isOpen, onClose, imageUrl, onSubmitCoordinates }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [startPosition, setStartPosition] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [new_cord, setNewCord] = useState(null); // Store only the latest rectangle's coordinates
  const [firstClickCoords, setFirstClickCoords] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      // Draw the latest rectangle if it exists
      if (new_cord) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        const width = new_cord[2] - new_cord[0];
        const height = new_cord[3] - new_cord[1];
        ctx.strokeRect(new_cord[0], new_cord[1], width, height);
      }
    };
  }, [imageUrl, isOpen, new_cord]);

  const calculateRelativePositionToCanvas = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const enableDrawingMode = (e) => {
    let position;
    if (!firstClickCoords) {
      position = calculateRelativePositionToCanvas(e);
      setFirstClickCoords(position);
      console.log('Selected first click coordinates:', position);
      setIsDrawingEnabled(true);
    }
  };

  const startDrawing = (e) => {
    if (!isDrawingEnabled) return;
    const position = calculateRelativePositionToCanvas(e);
    setStartPosition(position);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !startPosition) return;
    const position = calculateRelativePositionToCanvas(e);
    setCurrentPosition(position);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Draw the currently drawn rectangle
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      const width = position.x - startPosition.x;
      const height = position.y - startPosition.y;
      ctx.strokeRect(startPosition.x, startPosition.y, width, height);
    };
  };

  const endDrawing = () => {
    if (!isDrawing) return;

    const newRectangle = [
      startPosition.x,
      startPosition.y,
      currentPosition?.x, 
      currentPosition?.y, 
    ];

    setNewCord(newRectangle); 
    console.log('Latest rectangle coordinates:', newRectangle);
    setIsDrawing(false);
    setStartPosition(null);
    setCurrentPosition(null);
  };

  const handleContinue = () => {

    const coordinates = {
      x: firstClickCoords ? firstClickCoords.x : null,
      y: firstClickCoords ? firstClickCoords.y : null,
      new_cord: new_cord, 
    };

    console.log('Submitting coordinates:', coordinates);
    onSubmitCoordinates(coordinates);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative max-w-full max-h-full overflow-auto p-4">
        <canvas
          ref={canvasRef}
          onClick={enableDrawingMode}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          className="border border-gray-300"
          style={{ cursor: isDrawingEnabled ? 'crosshair' : 'pointer' }}
        ></canvas>

        <button
          onClick={onClose}
          className="fixed top-4 right-8 bg-red-600 rounded-full p-2 text-gray-600 hover:bg-gray-200 transition"
        >
          &times; {/* Close button */}
        </button>

        {/* Button to submit coordinates */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleContinue}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
