import React from 'react';

type ExpandableFAQProps = {
  title: string;
  text: JSX.Element;
};

export const ExpandableFAQ = (props: ExpandableFAQProps): JSX.Element => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex flex-row items-center justify-start gap-6 p-2.5 hover:cursor-pointer cursor-pointer">
        <div className={expanded ? 'transition rotate-90 duration-500' : 'transition rotate-0 duration-500'}>
          <div className="text-[32px] leading-[1.7] font-bold">+</div>
        </div>
        <span className="text-xl font-semibold leading-1.8">{props.title}</span>
      </button>
      <div className="w-full h-[3px] dark:bg-white bg-charcoal-300"></div>
      {expanded && <p className="text-base leading-[1.8] mx-13.5 my-6 font-normal tracking-[0.2px]">{props.text}</p>}
    </div>
  );
};
