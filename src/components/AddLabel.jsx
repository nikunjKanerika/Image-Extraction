import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../svg/Spinner';

const AddLabel = () => {
  const [imageSrc, setimageSrc] = useState();
  const [boxes, setBoxes] = useState([]); // Store all the boxes
  const [isDrawing, setIsDrawing] = useState(false); // Flag for drawing state
  const [startPoint, setStartPoint] = useState(null); // Starting point for rectangle
  const [currentBox, setCurrentBox] = useState(null); // Currently drawn box
  const [isloading, setisloading] = useState(true); // Loading state for the image
  const [isCanvasOpen, setisCanvasOpen] = useState(false); // Flag for canvas visibility
  const [showDescriptionInput, setShowDescriptionInput] = useState(false); // Flag to show the description input field
  const [newDescription, setNewDescription] = useState(''); // Store input description
  const canvasRef = useRef(null); // Reference to canvas element

  useEffect(() => {
    const handleDimensionless = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/dimensionless_img", {
          method: "GET",
        });

        if (response.ok) {
          const blob = await response.blob();
          const image = URL.createObjectURL(blob);
          setimageSrc(image);
          setisloading(false);
        } else {
          console.error("API failed with status:", response.status);
          setisloading(false);
        }
      } catch (err) {
        console.error("Error while invoking API:", err.message);
        setisloading(false);
      }
    };
    handleDimensionless();
  }, []);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!isDrawing) {
      setIsDrawing(true);
      setStartPoint({ x, y });
      setCurrentBox({ x, y, width: 0, height: 0 });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = x - startPoint.x;
    const height = y - startPoint.y;

    setCurrentBox({
      x: startPoint.x,
      y: startPoint.y,
      width: width,
      height: height,
    });
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      if (currentBox && currentBox.width !== 0 && currentBox.height !== 0) {
        setBoxes((prevBoxes) => [...prevBoxes, { ...currentBox, description: '' }]);
        setShowDescriptionInput(true);
      }
      console.log(boxes);
      setIsDrawing(false);
      setCurrentBox(null);
    }
  };

  const handleDescriptionSubmit = () => {
    // Add the description to the most recently added box
    setBoxes((prevBoxes) => {
      const updatedBoxes = [...prevBoxes];
      updatedBoxes[updatedBoxes.length - 1].description = newDescription;
      return updatedBoxes;
    });
    setNewDescription('');
    setShowDescriptionInput(false);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      // Draw the previously created boxes
      boxes.forEach((box) => {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(box.description, box.x + 5, box.y - 5); // Display description near the box
      });

      // Draw the current box if being drawn
      if (isDrawing && currentBox) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
      }
    };
  };

  useEffect(() => {
    if (isCanvasOpen && imageSrc) {
      drawCanvas();
    }
  }, [isCanvasOpen, imageSrc, boxes, currentBox]);

  const handleImageClick = () => {
    setisCanvasOpen(true);
  };

  const handleCloseCanvas = () => {
    setisCanvasOpen(false);
  };

  return (
    <>
      {isloading ? (
        <div className="flex justify-center mt-5 items-center">
          <Spinner/> <span>Loading Image</span>
        </div>
      ) : (
        <div className="flex w-full p-3">
          <div className="relative mt-5 mx-auto border bg-white rounded-md w-7/12">
            {imageSrc && (
              <div className="relative p-4 m-auto overflow-auto">
                <div className="relative">
                  <img
                    src={imageSrc}
                    alt="Processed PDF"
                    className="block w-full cursor-pointer h-3/5 md:h-1/6 lg:h-96"
                    onClick={handleImageClick}
                  />

                  {isCanvasOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                      <div className="relative my-4 w-11/12 max-h-screen overflow-auto bg-white p-4 rounded-lg">
                        <button
                          onClick={handleCloseCanvas}
                          className="fixed top-2 right-20 text-white bg-red-600 px-3 py-1 rounded"
                        >
                          Close
                        </button>
                        <canvas
                          ref={canvasRef}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          className="cursor-crosshair pointer-events-auto"
                        />

                        {/* Input for description just below the last drawn rectangle */}
                        {showDescriptionInput && boxes.length > 0 && (
                          <div
                            className="absolute bg-white p-3 border rounded shadow-md"
                            style={{
                              top: boxes[boxes.length - 1].y + boxes[boxes.length - 1].height + 10, // Below the rectangle
                              left: boxes[boxes.length - 1].x, // Aligned with the rectangle's left
                            }}
                          >
                            <input
                              type="text"
                              value={newDescription}
                              onChange={(e) => setNewDescription(e.target.value)}
                              placeholder="Enter description"
                              className="p-1 border rounded"
                            />
                            <button
                              onClick={handleDescriptionSubmit}
                              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AddLabel;
