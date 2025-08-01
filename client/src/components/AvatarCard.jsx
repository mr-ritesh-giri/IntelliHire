const AvatarCard = ({ src, alt, isSpeaking }) => {
  return (
    <div className="relative flex justify-center items-center">
      {isSpeaking && (
        <div className="absolute z-20">
          <video
            src="src/assets/equalizerCircle.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-96"
          />
        </div>
      )}
      <div className="w-60 h-60 lg:h-80 lg:w-80 xl:h-96 xl:w-96 z-10 rounded-full border-2 border-purple-700 border-dashed transition-all duration-300">
        <img src={src} alt={alt} className="w-full h-full rounded-full" />
      </div>
    </div>
  );
};

export default AvatarCard;
