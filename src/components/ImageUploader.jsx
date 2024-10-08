import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '../svg/UploadIcon';
import ImageModal from './ImageModal';
import { sendImageForProcessing, sendCoordinates } from '../service/api';
import Spinner from '../svg/Spinner';
import AnnotateModal from './AnnotateModal';

const ImageUploader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const openModal = () => {
    if (processedImage) {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const processPdf = async () => {
    if (!pdfFile) {
      console.error('No PDF file selected');
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      const imageUrl = await sendImageForProcessing(formData);
      setProcessedImage(imageUrl);
    } catch (error) {
      console.error('Error processing PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextButtonClick = () => {
    setShowOptionsModal(true);
  };

  const handleContinueWithCoordinates = async () => {
    if (!coordinates) {
      console.error('No coordinates available to send');
      return;
    }
    try {
      const response = await sendCoordinates(coordinates);
      console.log('Coordinates sent successfully:', response);
    } catch (error) {
      console.error('Error sending coordinates:', error);
    }

    setShowOptionsModal(false);
  };

  const handleGetDimensionLessImage = () => {
    setShowOptionsModal(false);
    navigate('/dimensionless_img');
  };

  const closeOptionsModal = () => {
    setShowOptionsModal(false);
  };

  const handleCoordinatesSubmit = async (coords) => {
    setCoordinates(coords);
    console.log('Received coordinates:', coords);
  };

  return (
    <div className="flex flex-col items-center mt-2 w-full">

      {/* Full-width Processed Image Display */}
      <div className="w-full">
        <div
          className=" p-2 border border-gray-300 items-center shadow-md rounded-lg flex flex-col w-11/12 mx-auto h-80"
          onClick={openModal}
        >
          <h2 className="text-lg font-semibold mb-2">Components Display</h2>
          <div className="flex-grow flex flex-col items-center justify-center overflow-hidden ">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Spinner size={50} color="#123abc" />
              </div>
            ) : processedImage ? (
              <img
                src={processedImage}
                alt="Processed"
                className="w-full h-full object-cover"
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center text-gray-400">
                <span>No Processed Image Available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Show PDF file name and Process button */}
      {pdfFile && (
        <div className="flex flex-col items-center mt-4">
          <span className="text-gray-700 mb-2">{pdfFile.name}</span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={processPdf}
          >
            Process PDF
          </button>
        </div>
      )}

      {/* Drag and Drop Zone with Continue Button Side-by-Side */}
      <div className="flex w-11/12 mt-4 items-center justify-between space-x-4">
        {/* Drag and Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          className={`w-9/12 h-32 p-4 border-2 ${isDragging ? 'border-blue-500' : 'border-gray-300'} border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors`}
        >
          <UploadIcon className="w-10 h-10 mb-2" />
          <span className="text-gray-600">Drag & Drop your PDF here or</span>
          <label className="cursor-pointer mt-2 text-blue-700">
            <input type="file" onChange={handlePdfChange} accept="application/pdf" className="hidden" />
            click to upload
          </label>
        </div>

        {/* Continue to Annotate Button */}
        <button
          className={`w-3/12 mt-20 bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            !processedImage ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          onClick={handleNextButtonClick}
          disabled={!processedImage}
        >
          Annotate
        </button>
      </div>

      {/* Modal for full-screen Image */}
      <ImageModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        imageUrl={processedImage} 
        onSubmitCoordinates={handleCoordinatesSubmit}
      />

      {/* Modal for annotation options */}
      {showOptionsModal && (
        <AnnotateModal isOpen={showOptionsModal} onClose={closeOptionsModal}>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Choose an option:</h2>
            <div className="flex space-x-4 justify-center">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleContinueWithCoordinates}
              >
                Send Coordinates
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleGetDimensionLessImage}
              >
                Get DimensionLess Image
              </button>
            </div>
          </div>
        </AnnotateModal>
      )}
    </div>
  );
};

export default ImageUploader;
