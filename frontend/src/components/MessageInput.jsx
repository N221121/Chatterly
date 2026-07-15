import React, { useRef, useState } from 'react'
import useKeyboardSound from './hooks/useKeyboardSound'
import { useChatStore } from '../store/useChatStore';
import toast from 'react-hot-toast';
import { ImageIcon, SendIcon, XIcon, Smile, Mic, Square } from 'lucide-react';
import EmojiPicker from "emoji-picker-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunks = useRef([]);
  const { sendMessage, isSoundEnabled
    , sendTyping, sendStopTyping } = useChatStore();

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);

    sendTyping();

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      sendStopTyping();
    }, 1000);
  };
  const typingTimeout = useRef(null);

  const handleTyping = (e) => {
    setText(e.target.value);

    if (isSoundEnabled) {
      playRandomKeyStrokeSound();
    }

    sendTyping();

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      sendStopTyping();
    }, 1000);
  };
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    setShowEmojiPicker(false);
    sendStopTyping();
    sendMessage({
      text: text.trim(),
      image: imagePreview
    })
    setText("")
    setImagePreview("")
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Clear previous recording
      audioChunks.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, {
        mimeType,
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.start(250);

      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      toast.error("Microphone permission denied");
    }
  };
  const stopRecording = () => {
    if (!mediaRecorder) return;

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, {
        type: mediaRecorder.mimeType,
      });

      console.log(audioBlob);

      const localUrl = URL.createObjectURL(audioBlob);

      const testAudio = new Audio(localUrl);

      testAudio.onended = () => {
        URL.revokeObjectURL(localUrl);
      };

      testAudio.play();

      const reader = new FileReader();

      reader.onloadend = () => {
        sendMessage({
          voice: reader.result,
        });

        // Clear the recorded chunks
        audioChunks.current = [];
      };

      reader.readAsDataURL(audioBlob);

      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.stop();
    setMediaRecorder(null);
    setIsRecording(false);
  };

  return (
    <div className="relative p-4 border-t border-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-2 z-[9999]">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="dark"
            width={320}
            height={400}
          />
        </div>
      )}
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex items-center space-x-4"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="bg-slate-800/50 rounded-lg p-2 text-slate-400 hover:text-yellow-400"
        >
          <Smile className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          className="flex-1 bg-slate-800/50 text-white placeholder:text-slate-400 border border-slate-700/50 rounded-lg py-2 px-4 focus:outline-none"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 rounded-lg px-4 py-2 transition-colors ${imagePreview
            ? "text-cyan-500"
            : "text-slate-400 hover:text-slate-200"
            }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2
             font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all
             disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
        {isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="bg-red-500 text-white p-2 rounded-lg"
          >
            <Square size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="bg-slate-800 text-white p-2 rounded-lg"
          >
            <Mic size={20} />
          </button>
        )}
      </form>
    </div>
  );

}

export default MessageInput
