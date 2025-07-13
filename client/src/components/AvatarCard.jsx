const AvatarCard = ({ src, alt }) => {
  return (
    <div className="relative flex justify-center items-center">
      <div className="absolute z-20">
        <video
          src="src/assets/equalizerCircle.webm"
          autoPlay
          loop
          muted
          playsInline
          className=""
        />
      </div>
      <div className="h-64 w-64 z-10 rounded-full border-2 border-purple-700 border-dashed animate-dj-glow transition-all duration-300">
        <img src={src} alt={alt} className="w-full h-full rounded-full" />
      </div>
    </div>
  );
};

export default AvatarCard;
