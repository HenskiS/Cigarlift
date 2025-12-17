// ImageViewer.jsx
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import ImageUpload from './ImageUpload';

const ImageViewer = ({
  imageData,
  type,
  onUpload,
  isUploading,
  uploadError,
  onDelete,
  isDeleting
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scale, setScale] = useState(1);

  const handleZoom = () => {
    setScale(prev => prev === 1 ? 2 : 1);
  };

  return (
    <>
      <Box 
        onClick={() => setIsExpanded(true)}
        sx={{
          position: 'relative',
          width: '100%',
          height: '200px',
          overflow: 'hidden',
          borderRadius: 1,
          cursor: 'pointer',
          '&:hover .zoom-overlay': {
            backgroundColor: 'rgba(0,0,0,0.3)',
            '& .zoom-icon': {
              opacity: 1
            }
          }
        }}
      >
        <img
          src={`data:image/jpeg;base64,${imageData}`}
          alt={`${type} image`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <Box 
          className="zoom-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
        >
          <ZoomInIcon 
            className="zoom-icon"
            sx={{
              color: 'white',
              opacity: 0,
              transition: 'opacity 0.2s',
            }} 
          />
        </Box>
      </Box>

      <Dialog
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2
        }}>
          <span style={{ textTransform: 'capitalize' }}>{type} Image</span>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ImageUpload
              onUpload={onUpload}
              isLoading={isUploading}
              error={uploadError}
              type={type}
              variant="compact"
            />
            <IconButton
              onClick={onDelete}
              size="small"
              disabled={isDeleting}
              sx={{ color: 'error.main' }}
              title="Delete image"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={handleZoom} size="small">
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={() => setIsExpanded(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{
          height: '600px',
          overflow: 'auto',
          p: 2
        }}>
          <img
            src={`data:image/jpeg;base64,${imageData}`}
            alt={`${type} image`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transform: `scale(${scale})`,
              transition: 'transform 0.2s'
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageViewer;