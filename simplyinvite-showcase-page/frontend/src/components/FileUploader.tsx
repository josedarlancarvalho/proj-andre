import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileText, X, Upload, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
  title?: string;
  description?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  maxSizeMB = 20,
  allowedFileTypes = [".pdf", ".ppt", ".pptx", ".doc", ".docx", ".zip"],
  title = "Arraste seu projeto ou clique para enviar",
  description = "Suporta arquivos PDF, PPT, DOC ou ZIP",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (fileToValidate: File): boolean => {
    setError(null);

    // Verificar tamanho
    if (fileToValidate.size > maxSizeBytes) {
      setError(`O arquivo excede o tamanho máximo de ${maxSizeMB}MB`);
      return false;
    }

    // Verificar tipo
    const fileExtension = `.${fileToValidate.name
      .split(".")
      .pop()
      ?.toLowerCase()}`;
    if (!allowedFileTypes.includes(fileExtension)) {
      setError(
        `Tipo de arquivo não suportado. Tipos permitidos: ${allowedFileTypes.join(
          ", "
        )}`
      );
      return false;
    }

    return true;
  };

  const handleFileSelection = (selectedFile: File) => {
    setIsVerifying(true);

    // Simular verificação de segurança
    setTimeout(() => {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
        toast.success("Arquivo selecionado com sucesso!");
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFileSelection(selectedFile);
    }
  };

  const handleButtonClick = () => {
    // Mostrar toast informando sobre a verificação de segurança
    if (!file) {
      toast.info("Será solicitada permissão para acessar seus arquivos", {
        description: "Escolha apenas arquivos seguros para upload",
        duration: 3000,
      });
    }

    // Abrir seletor de arquivos
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);

    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept={allowedFileTypes.join(",")}
        className="hidden"
      />

      {!file ? (
        <div
          className={`flex flex-col items-center justify-center p-8 border-2 ${
            isDragging ? "border-primary bg-primary/5" : "border-dashed"
          } rounded-lg transition-colors hover:bg-gray-50 cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <FileText
            size={48}
            className={`${
              isDragging ? "text-primary" : "text-muted-foreground"
            } mb-4`}
          />
          <div className="text-center">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {description} (máximo {maxSizeMB}MB)
            </p>
          </div>
          {isVerifying ? (
            <div className="mt-4 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
              <span>Verificando arquivo...</span>
            </div>
          ) : (
            <Button className="mt-4" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Selecionar Arquivo
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-md">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-3">
                <p className="font-medium truncate max-w-xs">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleRemoveFile}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-muted-foreground">
        <p>Arquivos permitidos: {allowedFileTypes.join(", ")}</p>
      </div>
    </div>
  );
};

export default FileUploader;
