import "./ImageEditor.css";
import { createPortal } from "react-dom";
import Img from "../Image/Image";
import { useRef, useEffect, useState } from "react";

export default function ImageEditor({ close, src, onSave }) {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [verticalFlip, setVerticalFlip] = useState(false);
  const [horizontalFlip, setHorizontalFlip] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
  });
  const [resizeHandle, setResizeHandle] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (cropMode && cropArea.width === 0) {
        const defaultCropSize = Math.min(img.width, img.height) * 0.5;
        setCropArea({
          x: (img.width - defaultCropSize) / 2,
          y: (img.height - defaultCropSize) / 2,
          width: defaultCropSize,
          height: defaultCropSize,
        });
      }
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(verticalFlip ? -1 : 1, horizontalFlip ? -1 : 1);
      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );
      ctx.restore();
      if (cropMode) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(verticalFlip ? -1 : 1, horizontalFlip ? -1 : 1);
        
        ctx.clearRect(
          cropArea.x - canvas.width / 2, 
          cropArea.y - canvas.height / 2, 
          cropArea.width, 
          cropArea.height
        );
        
        ctx.drawImage(
          img,
          cropArea.x, 
          cropArea.y, 
          cropArea.width, 
          cropArea.height,
          cropArea.x - canvas.width / 2, 
          cropArea.y - canvas.height / 2, 
          cropArea.width, 
          cropArea.height
        );
        
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          cropArea.x - canvas.width / 2, 
          cropArea.y - canvas.height / 2, 
          cropArea.width, 
          cropArea.height
        );
        
        const handleSize = Math.max(canvas.width, canvas.height) / 50;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = Math.max(canvas.width, canvas.height) / 1000;
        
        const originalHandles = [
          { x: cropArea.x, y: cropArea.y },
          { x: cropArea.x + cropArea.width, y: cropArea.y },
          { x: cropArea.x, y: cropArea.y + cropArea.height },
          { x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height }
        ];
        
        originalHandles.forEach(handle => {
          const x = handle.x - canvas.width / 2;
          const y = handle.y - canvas.height / 2;
          
          ctx.beginPath();
          ctx.arc(x, y, handleSize/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        });
        
        ctx.restore();
      }
    };
    img.src = src;
  }, [src, rotation, horizontalFlip, verticalFlip, cropMode, cropArea]);

  const handleApply = () => {
    const canvas = canvasRef.current;
    
    if (cropMode && cropArea.width > 0 && cropArea.height > 0) {
      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');
      
      croppedCanvas.width = cropArea.width;
      croppedCanvas.height = cropArea.height;
      
      const img = new Image();
      img.onload = () => {
        croppedCtx.save();
        croppedCtx.translate(croppedCanvas.width / 2, croppedCanvas.height / 2);
        croppedCtx.rotate((rotation * Math.PI) / 180);
        croppedCtx.scale(verticalFlip ? -1 : 1, horizontalFlip ? -1 : 1);
        
        croppedCtx.drawImage(
          img,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          -cropArea.width / 2,
          -cropArea.height / 2,
          cropArea.width,
          cropArea.height
        );
        croppedCtx.restore();
        
        croppedCanvas.toBlob(
          (blob) => {
            const file = new File([blob], "edited-image.jpg", {
              type: "image/jpeg",
            });
            onSave(file);
            close();
          },
          "image/jpeg",
          1.0
        );
      };
      img.src = src;
    } else {
      canvas.toBlob(
        (blob) => {
          const file = new File([blob], "edited-image.jpg", {
            type: "image/jpeg",
          });
          onSave(file);
          close();
        },
        "image/jpeg",
        1.0
      );
    }
  };

  const handleRotate = () => {
    setRotation((prev) => prev - (90 % 360));
    if (cropMode) {
      setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    }
  };

  const handleVerticalFlip = () => {
    setVerticalFlip((prev) => !prev);
    if (cropMode) {
      setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    }
  };

  const handleHorizontalFlip = () => {
    setHorizontalFlip((prev) => !prev);
    if (cropMode) {
      setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    }
  };

  const handleCropMode = () => {
    setCropMode((prev) => !prev);
  };

  const transformMouseCoords = (mouseX, mouseY, canvas) => {
    let x = mouseX - canvas.width / 2;
    let y = mouseY - canvas.height / 2;
    
    const rad = (-rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rotatedX = x * cos - y * sin;
    const rotatedY = x * sin + y * cos;
    
    let newX = rotatedX;
    let newY = rotatedY;
    
    if (verticalFlip) newX = -newX;
    if (horizontalFlip) newY = -newY;
    
    return {
      x: newX + canvas.width / 2,
      y: newY + canvas.height / 2
    };
  };

  const adjustAspectRatio = (area, canvas) => {
    let newArea = { ...area };
    const aspectRatio = newArea.height / newArea.width;
    const maxHeight = 1.5;
    const maxWidth = 2;
    
    if (aspectRatio > maxHeight) {
      newArea.height = newArea.width * maxHeight;
    } else if (newArea.width / newArea.height > maxWidth) {
      newArea.width = newArea.height * maxWidth;
    }
    
    newArea.x = Math.max(0, Math.min(canvas.width - newArea.width, newArea.x));
    newArea.y = Math.max(0, Math.min(canvas.height - newArea.height, newArea.y));
    newArea.width = Math.min(canvas.width - newArea.x, newArea.width);
    newArea.height = Math.min(canvas.height - newArea.y, newArea.height);
    
    return newArea;
  };

  const getResizeHandle = (x, y) => {
    const canvas = canvasRef.current;
    const handleSize = Math.max(canvas.width, canvas.height) / 50;
    const tolerance = handleSize * 1.5;
    
    const handles = [
      { name: 'top-left', x: cropArea.x, y: cropArea.y },
      { name: 'top-right', x: cropArea.x + cropArea.width, y: cropArea.y },
      { name: 'bottom-left', x: cropArea.x, y: cropArea.y + cropArea.height },
      { name: 'bottom-right', x: cropArea.x + cropArea.width, y: cropArea.y + cropArea.height }
    ];
    
    for (const handle of handles) {
      if (Math.abs(x - handle.x) <= tolerance && Math.abs(y - handle.y) <= tolerance) {
        return handle.name;
      }
    }
    return null;
  };

  const handleMouseDown = (e) => {
    if (!cropMode) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const transformed = transformMouseCoords(mouseX, mouseY, canvas);

    const handleType = getResizeHandle(transformed.x, transformed.y);
    
    if (handleType) {
      setResizeHandle(handleType);
      setIsDragging(true);
      setDragStart({ x: transformed.x, y: transformed.y });
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      const isInsideCrop =
        transformed.x >= cropArea.x &&
        transformed.x <= cropArea.x + cropArea.width &&
        transformed.y >= cropArea.y &&
        transformed.y <= cropArea.y + cropArea.height;

      if (isInsideCrop) {
        setResizeHandle(null);
        setIsDragging(true);
        setDragStart({ x: transformed.x, y: transformed.y });
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !cropMode) {
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentMouseX = (e.clientX - rect.left) * scaleX;
    const currentMouseY = (e.clientY - rect.top) * scaleY;

    const transformed = transformMouseCoords(currentMouseX, currentMouseY, canvas);
    
    if (resizeHandle) {
      const deltaX = transformed.x - dragStart.x;
      const deltaY = transformed.y - dragStart.y;
      
      setCropArea((prev) => {
        let newArea = { ...prev };
        
        switch (resizeHandle) {
          case 'top-left':
            newArea.x = prev.x + deltaX;
            newArea.y = prev.y + deltaY;
            newArea.width = Math.max(20, prev.width - deltaX);
            newArea.height = Math.max(20, prev.height - deltaY);
            break;
          case 'top-right':
            newArea.y = prev.y + deltaY;
            newArea.width = Math.max(20, prev.width + deltaX);
            newArea.height = Math.max(20, prev.height - deltaY);
            break;
          case 'bottom-left':
            newArea.x = prev.x + deltaX;
            newArea.width = Math.max(20, prev.width - deltaX);
            newArea.height = Math.max(20, prev.height + deltaY);
            break;
          case 'bottom-right':
            newArea.width = Math.max(20, prev.width + deltaX);
            newArea.height = Math.max(20, prev.height + deltaY);
            break;
        }
        
        newArea.x = Math.max(0, Math.min(canvas.width - newArea.width, newArea.x));
        newArea.y = Math.max(0, Math.min(canvas.height - newArea.height, newArea.y));
        newArea.width = Math.min(canvas.width - newArea.x, newArea.width);
        newArea.height = Math.min(canvas.height - newArea.y, newArea.height);
        
        return newArea;
      });
    } else {
      const deltaX = transformed.x - dragStart.x;
      const deltaY = transformed.y - dragStart.y;

      setCropArea((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(canvas.width - prev.width, prev.x + deltaX)),
        y: Math.max(0, Math.min(canvas.height - prev.height, prev.y + deltaY)),
      }));
    }
    
    setDragStart({ x: transformed.x, y: transformed.y });
  };

  const handleMouseUp = () => {
    if (isDragging && resizeHandle) {
      const canvas = canvasRef.current;
      setCropArea((prev) => adjustAspectRatio(prev, canvas));
    }
    setIsDragging(false);
    setResizeHandle(null);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return createPortal(
    <div className="image-editor-container" onClick={close}>
      <div className="image-editor-window" onClick={(e) => e.stopPropagation()}>
        <div className="top">
          <div className="image-area">
            <div className="edit-image-container">
              <canvas
                className="edited-image"
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              ></canvas>
            </div>
          </div>
          <div className="edit-area">
            <button className="edit-button" onClick={handleRotate}>
              <Img
                src={"/icons/rotate.svg"}
                w={80}
                className={"button-image"}
              />
            </button>
            <button className="edit-button" onClick={handleVerticalFlip}>
              <Img
                src={"/icons/vertical-flip.svg"}
                w={80}
                className={"button-image"}
              />
            </button>
            <button className="edit-button" onClick={handleHorizontalFlip}>
              <Img
                src={"/icons/horizontal-flip.svg"}
                w={80}
                className={"button-image"}
              />
            </button>
            <button className="edit-button" onClick={handleCropMode}>
              <Img src={"/icons/crop.svg"} w={80} className={"button-image"} />
            </button>
          </div>
        </div>
        <div className="button-group">
          <button className="done-button" onClick={close}>
            Cancel
          </button>
          <button className="done-button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
