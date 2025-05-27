import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Video, StopCircle, Save, RefreshCw } from "lucide-react";

interface VideoRecorderProps {
  onSave?: (videoBlob: Blob) => void;
  onCancel?: () => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ onSave, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  // Iniciar a webcam quando o componente carregar
  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
    };
  }, []);

  // Contador para tempo de gravação
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Efeito para countdown antes de iniciar gravação
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      startRecording();
      setCountdown(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setError(null);
      }
    } catch (err) {
      console.error("Erro ao acessar webcam:", err);
      setError(
        "Não foi possível acessar sua câmera ou microfone. Verifique as permissões do navegador."
      );
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const prepareRecording = () => {
    setCountdown(3); // Iniciar contagem regressiva de 3 segundos
  };

  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      setError("Webcam não está ativa");
      return;
    }

    try {
      const stream = videoRef.current.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoURL(url);
        setRecordedChunks(chunks);
        setIsPreviewing(true);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error("Erro ao iniciar gravação:", err);
      setError(
        "Não foi possível iniciar a gravação. Verifique as permissões do navegador."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSave = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      if (onSave) onSave(blob);
    }
  };

  const resetRecording = () => {
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL);
    }
    setRecordedVideoURL(null);
    setRecordedChunks([]);
    setIsPreviewing(false);
    startWebcam();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
        {!isPreviewing ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        ) : (
          <video
            className="w-full h-full object-cover"
            src={recordedVideoURL || undefined}
            controls
            autoPlay
            playsInline
          />
        )}

        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-7xl font-bold">{countdown}</span>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-md flex items-center">
            <span className="animate-pulse mr-2">●</span>
            <span>{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4 justify-center">
        {!isRecording && !isPreviewing && (
          <Button onClick={prepareRecording}>
            <Video className="mr-2 h-4 w-4" />
            Iniciar Gravação
          </Button>
        )}

        {isRecording && (
          <Button variant="destructive" onClick={stopRecording}>
            <StopCircle className="mr-2 h-4 w-4" />
            Parar Gravação
          </Button>
        )}

        {isPreviewing && (
          <>
            <Button variant="default" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Vídeo
            </Button>
            <Button variant="outline" onClick={resetRecording}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Gravar Novamente
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
