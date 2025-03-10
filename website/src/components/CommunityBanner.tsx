import React from 'react';

function Banner(): JSX.Element {
  return (
    <div className="w-full flex flex-row justify-center items-center py-2 bg-gradient-to-r from-sky-700 to-purple-700 overflow-hidden px-5">
      <div className="mx-3 relative text-white font-semibold">
        <img className="inline h-10 align-middle mr-1" alt="Large box" src="img/banner/large_box.png" />
        <img className="inline h-4 align-bottom mr-6" alt="Small box" src="img/banner/small_box.png" />
        Join us for the first Podman Desktop Community Meeting on March 27th! RSVP
        <a
          href="https://github.com/podman-desktop/community/issues/3"
          target="_blank"
          className="underline text-white ml-1">
          here.
        </a>
        <img className="inline h-10 align-middle ml-6" alt="Large box" src="img/banner/large_box.png" />
      </div>
    </div>
  );
}

export default Banner;
