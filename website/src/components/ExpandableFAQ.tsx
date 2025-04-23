import React from 'react';

export type ExpandableFAQProps = {
  title: string;
  text: string;
};

export const ExpandableFAQ = (props: ExpandableFAQProps): JSX.Element => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
      <div className="flex flex-row items-center justify-start gap-6 p-2.5">
        <div className={expanded ? 'transition rotate-90 duration-500' : 'transition rotate-0 duration-500'}>
          <button onClick={() => setExpanded(!expanded)} className="text-[32px] leading-[1.7] font-bold">
            +
          </button>
        </div>
        <span className="text-xl font-semibold leading-1.8">{props.title}</span>
      </div>
      <div className="w-full h-1 bg-white"></div>
      {expanded && <p className="text-base leading-[1.8] mx-13.5 my-6 font-normal tracking-[0.2px]">{props.text}</p>}
    </div>
  );
};
