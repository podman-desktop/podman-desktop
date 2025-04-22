import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export type TestimonialCardProps = {
  cardNumber: string;
  username: string;
  text: string;
  name?: string;
  date?: string;
};

export const TestimonialCard = (props: TestimonialCardProps): JSX.Element => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-sky-500 to-fuschia-500 p-[2px] rounded-lg">
      <div className="absolute right-1/15 -top-6.5 rounded-full w-13 h-13 text-2xl font-black bg-gradient-to-br from-sky-500 to-fuschia-500 content-center text-center">
        {props.cardNumber}
      </div>
      <div className="bg-transparent rounded-lg p-6 h-full">
        <div className="flex flex-row items-center">
          <FontAwesomeIcon
            size="3x"
            icon={faCircleUser}
            className="w-13 h-13 text-sky-800 bg-white border-2 border-white rounded-full"
          />
          <div className="ml-6">
            <p className="font-semibold text-lg m-0 leading-1.6">@{props.username}</p>
            {(props?.name ?? props?.date) && (
              <p className="text-xs m-0 leading-1.6">
                {props.name} {props.date}
              </p>
            )}
          </div>
        </div>
        <div className="w-1/2 h-0.5 bg-purple-400 my-4 mx-auto"></div>
        <p className="text-sm leading-1.6">{props.text}</p>
      </div>
    </div>
  );
};
