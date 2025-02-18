import React, { useRef, useState } from 'react';
import { 
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert
} from '@mui/material';
import { 
  Upload as UploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const ImageUpload = ({ 
  onUpload,
  isLoading = false,
  error = null,
  type = 'image',
  capture = false,
  variant = 'normal' // 'normal' or 'compact'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  if (variant === 'compact') {
    return (
      <Box>
        <input
          ref={inputRef}
          type="file"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleChange}
          capture={capture ? "environment" : undefined}
        />
        <Button
          variant="outlined"
          component="span"
          size="small"
          startIcon={isLoading ? <CircularProgress size={20} /> : <UploadIcon />}
          disabled={isLoading}
          onClick={handleClick}
        >
          {isLoading ? 'Uploading...' : 'Upload New'}
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Upload failed: {error?.data?.message || 'Unknown error'}
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '200px',
        backgroundColor: 'grey.100',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: theme => `2px dashed ${dragActive ? theme.palette.primary.main : theme.palette.grey[300]}`,
        transition: 'border-color 0.2s',
        position: 'relative'
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleChange}
        capture={capture ? "environment" : undefined}
      />
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 2
      }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <ImageIcon sx={{ fontSize: 48, color: 'grey.400' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" color="textPrimary" gutterBottom>
                Upload {type} image
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Drag and drop or click to select
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={handleClick}
            >
              Select File
            </Button>
          </>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, position: 'absolute', bottom: 8 }}>
          Upload failed: {error?.data?.message || 'Unknown error'}
        </Alert>
      )}
    </Box>
  );
};

export default ImageUpload;