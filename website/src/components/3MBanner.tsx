import React from 'react';

function Banner(): JSX.Element {
  return (
    <div className="w-full h-fit px-2 flex flex-row justify-center items-center bg-gradient-to-r from-purple-300 to-purple-700 sm:text-2xl">
      <div className="relative sm:w-[310px] w-[230px] h-20 shrink-0">
        <img
          className="absolute sm:left-0 sm:top-[-10px] sm:w-[76px] left-0 top-[-7px] w-[60px]"
          alt="3 balloon"
          src="img/3MBanner/balloon-3.png"
        />
        <img
          className="absolute sm:left-[55px] sm:top-[9px] sm:w-[64px] top-[6px] left-[40px] w-[50px] -rotate-10 "
          alt="0 balloon"
          src="img/3MBanner/balloon-0.png"
        />
        <img
          className="absolute sm:left-[87px] sm:top-[19px] sm:w-[64px] top-[14px] left-[62px] w-[50px] "
          alt="0 balloon"
          src="img/3MBanner/balloon-0.png"
        />
        <img
          className="absolute sm:left-[121px] sm:top-[8px] sm:w-[64px] top-[5px] left-[86px] w-[50px] "
          alt="0 balloon"
          src="img/3MBanner/balloon-0.png"
        />
        <img
          className="absolute sm:left-[173px] sm:top-[16px] sm:w-[64px] top-[12px] left-[123px] w-[50px] -rotate-7 "
          alt="0 balloon"
          src="img/3MBanner/balloon-0.png"
        />
        <img
          className="absolute sm:left-[209px] sm:top-[12px] sm:w-[64px] top-[9px] left-[144px] w-[50px] rotate-6 "
          alt="0 balloon"
          src="img/3MBanner/balloon-0.png"
        />
        <img
          className="absolute sm:left-[245px] sm:top-[4px] sm:w-[64px] top-[3px] left-[170px] w-[50px] "
          alt="0 balloon"
          src="img/3MBanner/balloon-0.png"
        />
      </div>
      <div className="flex-initial whitespace-normal break-words sm:text-2xl text-2xl overflow-hidden font-black">
        downloads. <span className="font-light sm:text-2xl text-base"> Proven in the real world.</span>{' '}
        <a href="https://3m.podman-desktop.io" className="font-semibold sm:text-2xl text-base underline text-red-200">
          Celebrate!
        </a>
      </div>
    </div>
  );
}

export default Banner;
