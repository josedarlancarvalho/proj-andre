
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

interface VideoPlayerProps {
  title: string;
  videoUrl?: string;
  onRecord?: () => void;
}

const VideoPlayer = ({ title, videoUrl, onRecord }: VideoPlayerProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {videoUrl ? (
          <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-cover"
            />
            {onRecord && (
              <div className="absolute bottom-4 right-4">
                <Button size="sm" onClick={onRecord}>
                  Regravar
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center">
            <Video className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum vídeo disponível
            </p>
            {onRecord && (
              <Button size="sm" onClick={onRecord} className="mt-4">
                Gravar vídeo
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
