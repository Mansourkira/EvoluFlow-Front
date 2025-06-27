"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, Image as ImageIcon, User } from "lucide-react";
import { convertFileToBase64, validateImageFile } from "@/schemas/userSchema";

interface ImageUploadProps {
  label?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  showRemoveButton?: boolean;
  acceptedFormats?: string[];
  maxSizeInMB?: number;
}

export function ImageUpload({
  label = "Image",
  value,
  onChange,
  onError,
  placeholder = "Choisir une image",
  className = "",
  size = "md",
  shape = "circle",
  showRemoveButton = true,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  maxSizeInMB = 5,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-lg",
  };

  const handleFileSelect = async (file: File) => {
    const validation = validateImageFile(file);
    
    if (!validation.isValid) {
      onError?.(validation.error!);
      return;
    }

    // Additional custom validation
    if (file.size > maxSizeInMB * 1024 * 1024) {
      onError?.(`L'image ne doit pas dépasser ${maxSizeInMB}MB.`);
      return;
    }

    if (!acceptedFormats.includes(file.type)) {
      onError?.(`Format non supporté. Utilisez ${acceptedFormats.join(", ")}.`);
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      onChange(base64);
    } catch (error) {
      onError?.("Erreur lors du traitement de l'image.");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div className="flex items-center gap-4">
        {/* Image Preview */}
        <div 
          className={`
            relative ${sizeClasses[size]} ${shapeClasses[shape]} 
            border-2 border-dashed border-gray-300 
            flex items-center justify-center 
            bg-gray-50 cursor-pointer transition-colors
            ${isDragging ? 'border-blue-400 bg-blue-50' : ''}
            ${value ? 'border-solid border-gray-200' : ''}
          `}
          onClick={triggerFileSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {value ? (
            <>
              <Avatar className={`${sizeClasses[size]} ${shapeClasses[shape]}`}>
                <AvatarImage src={value} alt="Preview" className="object-cover" />
                <AvatarFallback>
                  <User className="h-6 w-6 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              
              {showRemoveButton && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </>
          ) : (
            <div className="text-center">
              {isDragging ? (
                <Upload className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              ) : (
                <ImageIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              )}
              <p className="text-xs text-gray-500">
                {isDragging ? "Déposer ici" : "Cliquer ou glisser"}
              </p>
            </div>
          )}
        </div>

        {/* File Input and Description */}
        <div className="flex-1 space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleInputChange}
            className="cursor-pointer"
            placeholder={placeholder}
          />
          
          <div className="space-y-1">
            <p className="text-xs text-gray-500">
              Formats acceptés: {acceptedFormats.join(", ").replace(/image\//g, "").toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">
              Taille maximale: {maxSizeInMB}MB
            </p>
          </div>

          {value && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={triggerFileSelect}
                className="flex items-center gap-1"
              >
                <Upload className="h-3 w-3" />
                Changer
              </Button>
              
              {showRemoveButton && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                  Supprimer
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 