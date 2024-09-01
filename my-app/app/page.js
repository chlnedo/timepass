"use client";
import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
// Adjust path as needed

const staticData = {
  isOpen: true,
  network: { network: 'Ethereum' },
  address: '0x1234567890abcdef1234567890abcdef12345678',
  dmin: 0.01,
  dmax: 100,
  coin: 'ETH',
};

function SaveAndShareModal() {
  const contentRef = useRef(null);

  // Generate image from the content
  const dataURLtoBlob = (dataUrl) => {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([arrayBuffer], { type: mimeString });
  };
  
  const handleGenerateImage = async () => {
    if (contentRef.current) {
      const dataUrl = await toPng(contentRef.current);
      return dataURLtoBlob(dataUrl);
    }
    return null;
  };

  const handleShareOnWhatsApp = async () => {
    const imageBlob = await handleGenerateImage();
    if (imageBlob) {
      try {
        const file = new File(
          [imageBlob],
          `Deposit_${staticData.coin}_${staticData.network.network}.png`,
          { type: 'image/png' }
        );
  
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'Deposit Info',
            text: `Network: ${staticData.network.network}\nAddress: ${staticData.address}`,
          });
        } else {
          console.error('Web Share API is not supported on this browser.');
        }
      } catch (error) {
        console.error('Failed to share image:', error);
      }
    } else {
      console.error('Failed to generate the image.');
    }
  };
  
  
  

  const handleDownloadImage = async () => {
    const dataUrl = await handleGenerateImage();
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Deposit_${staticData.coin}_${staticData.network.network}.png`; // Corrected here
      link.click();
    } else {
      console.error('Failed to generate the image.');
    }
  };
  
  return (
    <div style={{ display: staticData.isOpen ? 'block' : 'none', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', width: '400px', margin: '20px auto' }}>
      <div ref={contentRef} style={{ padding: '20px', textAlign: 'center', backgroundColor: 'green', borderRadius: '8px' }}>
        <h3>Deposit {staticData.coin} to {staticData.network.network}</h3>
        <div style={{ marginBottom: '10px' }}>
          <strong>Network:</strong> {staticData.network.network}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Address:</strong> {staticData.address}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Min Deposit Amount:</strong> {staticData.dmin} {staticData.coin}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Max Deposit Amount:</strong> {staticData.dmax} {staticData.coin}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={handleDownloadImage} style={buttonStyle}>
          Download Image
        </button>
        <button onClick={handleShareOnWhatsApp} style={buttonStyle}>
          Share on WhatsApp
        </button>
        {/* Add other social media sharing buttons here */}
      </div>
    </div>
  );
}

const buttonStyle = {
  margin: '5px',
  padding: '10px 15px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#007bff',
  color: '#fff',
};

export default SaveAndShareModal;

// "use client";
// import React, { useRef } from 'react';
// import { toPng } from 'html-to-image';
// import { storage, ref, uploadString, getDownloadURL } from './firebaseConfig'; // Adjust path as needed

// const staticData = {
//   isOpen: true,
//   network: { network: 'Ethereum' },
//   address: '0x1234567890abcdef1234567890abcdef12345678',
//   dmin: 0.01,
//   dmax: 100,
//   coin: 'ETH',
// };

// function SaveAndShareModal() {
//   const contentRef = useRef(null);

//   // Generate image from the content
//   const handleGenerateImage = async () => {
//     if (contentRef.current) {
//       const dataUrl = await toPng(contentRef.current);
//       return dataUrl;
//     }
//     return '';
//   };

//   // Upload image to Firebase Storage and get the download URL
//   const uploadImageToFirebase = async (dataUrl) => {
//     const storageRef = ref(storage, images/${Date.now()}.png);
//     await uploadString(storageRef, dataUrl, 'data_url');
//     const downloadUrl = await getDownloadURL(storageRef);
//     return downloadUrl;
//   };

//   // Share image on WhatsApp with Firebase URL
//   const handleShareOnWhatsApp = async () => {
//     const dataUrl = await handleGenerateImage();
//     if (dataUrl) {
//       try {
//         const imageUrl = await uploadImageToFirebase(dataUrl);
//         const message = Check out this image! \n\nNetwork: ${staticData.network.network}\nAddress: ${staticData.address}\nImage: ${imageUrl};
//         const whatsappUrl = https://api.whatsapp.com/send?text=${encodeURIComponent(message)};
//         window.open(whatsappUrl, '_blank');
//       } catch (error) {
//         console.error('Failed to upload image:', error);
//       }
//     } else {
//       console.error('Failed to generate the image.');
//     }
//   };

//   const handleDownloadImage = async () => {
//     const dataUrl = await handleGenerateImage();
//     if (dataUrl) {
//       const link = document.createElement('a');
//       link.href = dataUrl;
//       link.download = Deposit_${staticData.coin}_${staticData.network.network}.png;
//       link.click();
//     } else {
//       console.error('Failed to generate the image.');
//     }
//   };

//   return (
//     <div style={{ display: staticData.isOpen ? 'block' : 'none', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', width: '400px', margin: '20px auto' }}>
//       <div ref={contentRef} style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
//         <h3>Deposit {staticData.coin} to {staticData.network.network}</h3>
//         <div style={{ marginBottom: '10px' }}>
//           <strong>Network:</strong> {staticData.network.network}
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <strong>Address:</strong> {staticData.address}
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <strong>Min Deposit Amount:</strong> {staticData.dmin} {staticData.coin}
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <strong>Max Deposit Amount:</strong> {staticData.dmax} {staticData.coin}
//         </div>
//       </div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
//         <button onClick={handleDownloadImage} style={buttonStyle}>
//           Download Image
//         </button>
//         <button onClick={handleShareOnWhatsApp} style={buttonStyle}>
//           Share on WhatsApp
//         </button>
//         {/* Add other social media sharing buttons here */}
//       </div>
//     </div>
//   );
// }

// const buttonStyle = {
//   margin: '5px',
//   padding: '10px 15px',
//   fontSize: '14px',
//   cursor: 'pointer',
//   borderRadius: '4px',
//   border: 'none',
//   backgroundColor: '#007bff',
//   color: '#fff',
// };

// export default SaveAndShareModal;