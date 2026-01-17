import React from 'react';

function PodmanMeetingBanner(): JSX.Element {
  return (
    <div className="w-full flex flex-row justify-center items-center py-4 bg-gradient-to-r from-sky-700 to-purple-700 overflow-hidden px-5">
      <div className="mx-5 relative text-xl text-white font-semibold flex items-center">
        <img className="h-8 mr-3" alt="podman-seal" src="/img/banner/podman-meeting-seal.png" />
        <span>
          Looking for Podman Community Meetings?
          <a href="https://podman.io/community" target="_blank" rel="noreferrer" className="underline text-white ml-1">
            Click here
          </a>
        </span>
      </div>
    </div>
  );
}

export default PodmanMeetingBanner;
