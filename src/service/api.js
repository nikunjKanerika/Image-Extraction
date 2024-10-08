const baseURL = process.env.REACT_APP_BASE_URL;

const sendImageForProcessing = async (formData) => {
  try {
    const response = await fetch(`${baseURL}/process_pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error processing the image');
    }

    // Retrieve the image as a Blob
    const imageBlob = await response.blob();

    const imageUrl = URL.createObjectURL(imageBlob);

    return imageUrl;
  } catch (error) {
    console.error('Error in sending image to backend:', error);
  }
};

// Send coordinates for a new rectangle shape
const sendCoordinates = async (coordinates) => {
  try {
    const response = await fetch(`${baseURL}/user_modified_dimensions`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(coordinates),
    });

    if (!response.ok) {
      throw new Error('Error processing the image');
    }

    // Retrieve the image as a Blob
    const imageBlob = await response.blob();

    const imageUrl = URL.createObjectURL(imageBlob);

    return imageUrl;
  } catch (error) {
    console.error('Error in sending image to backend:', error);
  }
};

const getDimensionlessImage = async () => {
  try {
    const response = await fetch(`${baseURL}/dimensionless_img`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error processing the image');
    }

    // Retrieve the image as a Blob
    const imageBlob = await response.blob();

    const imageUrl = URL.createObjectURL(imageBlob);

    return imageUrl;
  } catch (error) {
    console.error('Error in receiving image:', error);
  }
};

export { sendImageForProcessing, sendCoordinates, getDimensionlessImage };
