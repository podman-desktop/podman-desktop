import React from 'react';

function Banner(): JSX.Element {
  return (
    <div className="w-full flex flex-row justify-center items-center py-0.5 bg-gradient-to-r from-sky-700 to-purple-700 overflow-hidden px-5">
      <div className="mx-3 relative text-white font-semibold">
        <img className="inline h-8 align-middle mr-1" alt="Large box" src="img/banner/large_box.png" />
        <img className="inline h-3 align-bottom mr-6" alt="Small box" src="img/banner/small_box.png" />
        Join us for the{' '}
        <a
          href="https://github.com/podman-desktop/community/blob/main/meetings/README.md#upcoming-community-meeting"
          target="_blank"
          rel="noreferrer"
          className="underline text-white ml-1">
          Next Podman Desktop Community Meeting
        </a>
        <img className="inline h-10 align-middle ml-6" alt="Large box" src="img/banner/large_box.png" />
      </div>
    </div>
  );
}

export default Banner;
