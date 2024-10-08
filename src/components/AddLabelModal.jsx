import React, { useState, useEffect, useRef } from 'react';

const AddLabelModal = () => {
  const [imageSrc, setimageSrc] = useState();
  const [boxes, setBoxes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentBox, setCurrentBox] = useState(null);
  const [isloading, setisloading] = useState(true);
  const [isCanvasOpen, setisCanvasOpen] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleDimensionless = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/dimensionless_img", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const image = URL.createObjectURL(blob);
          setimageSrc(image);
          setisloading(false);
          console.log("Successfully processed and received the dimensionless image");
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
        setShowDescriptionInput(true); // Show input for description after drawing
      }
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

      boxes.forEach((box) => {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(box.description, box.x + 5, box.y - 5); // Display description near the box
      });

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
        <div className="flex justify-center items-center">
          {/* <Loader /> */} 
          Loading
        </div>
      ) : (
        <div className='flex w-full p-3 '>
          <div className="relative mt-5 mx-auto border bg-white rounded-md w-11/12">
            {imageSrc && (
              <div className='relative p-4 m-auto overflow-auto'>
                <div className='relative'>
                  <img
                    src={imageSrc}
                    alt="Processed PDF"
                    className='block w-full cursor-pointer h-3/5 md:h-1/6 lg:h-96'
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
                          className='cursor-crosshair pointer-events-auto'
                        />
                        {showDescriptionInput && (
                          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-3 border rounded shadow-md">
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

export default AddLabelModal;