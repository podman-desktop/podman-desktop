import React from 'react';

//Properties
interface CommunityVideoCardProps {
  readonly url: string;
  readonly thumbnail: string;
  readonly alt: string;
  readonly caption: string;
}

// CommunityVideoCard component
function CommunityVideoCard({ url, thumbnail, caption, alt }: CommunityVideoCardProps): JSX.Element {
  return (
    <div className="flex flex-col items-center mb-6">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full relative mb-8">
        <img
          src={thumbnail}
          alt={alt}
          className="w-[243px] h-[134px] rounded border-2 opacity-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer block object-cover"
        />
        <img
          src="/img/play-overlay-button.png"
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[60px] h-[60px] opacity-80"
        />
      </a>
      <p className="mb-4">{caption}</p>
    </div>
  );
}

export default CommunityVideoCard;
