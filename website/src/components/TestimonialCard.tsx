import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type TestimonialCardProps = {
  username: string;
  text: string;
  source?: string;
  date?: string;
  userImage?: string;
};

export const TestimonialCard = (props: TestimonialCardProps): JSX.Element => {
  let separator = '';
  if (props.source && props.date) {
    separator = ', ';
  }

  const [showIcon, setShowIcon] = React.useState(false);

  return (
    <div className="relative min-w-fit w-full h-full bg-gradient-to-br from-sky-500 to-fuchsia-500 p-[2px] rounded-lg ">
      <img src="/img/quote.svg" alt="Quote symbol" className="absolute right-1/15 -top-6.5 rounded-full w-13 h-13 " />
      <div className="dark:bg-fuchsia-900 bg-purple-200 rounded-lg h-full">
        <div className="rounded-lg p-6 h-full bg-white/50 dark:bg-black/70">
          <div className="flex flex-row items-center">
            {props.userImage && !showIcon ? (
              <img
                src={props.userImage}
                onError={() => setShowIcon(true)}
                alt="user profile image"
                className="w-13 h-13 rounded-full"
              />
            ) : (
              <FontAwesomeIcon
                size="3x"
                icon={faCircleUser}
                className="w-13 h-13 text-sky-800 bg-white border-2 border-white rounded-full"
              />
            )}
            <div className="ml-6">
              <p className="font-semibold text-lg m-0 leading-1.6">@{props.username}</p>
              {(props?.source ?? props?.date) && (
                <p className="text-xs m-0 leading-1.6">
                  {props.source} {separator} {props.date}
                </p>
              )}
            </div>
          </div>
          <div className="w-1/2 h-0.5 bg-purple-400 my-4 mx-auto"></div>
          <p className="text-sm leading-1.6">{props.text}</p>
        </div>
      </div>
    </div>
  );
};
