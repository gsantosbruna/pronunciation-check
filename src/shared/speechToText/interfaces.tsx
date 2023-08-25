export interface Word {
  startTime: {
    seconds: string;
    nanos: number;
  };
  endTime: {
    seconds: string;
    nanos: number;
  };
  word: string;
  confidence: number;
  speakerTag: number;
}
