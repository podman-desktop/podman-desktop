/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// based on https://github.com/microsoft/vscode/blob/3eed9319874b7ca037128962593b6a8630869253/src/vs/base/common/charCode.ts

// Names from https://blog.codinghorror.com/ascii-pronunciation-rules-for-programmers/

/**
 * An inlined enum containing useful character codes (to be used with String.charCodeAt).
 * Please leave the const keyword such that it gets inlined when compiled to JavaScript!
 */
export const enum CharCode {
  Null = 0,
  /**
   * The `\b` character.
   */
  Backspace = 8,
  /**
   * The `\t` character.
   */
  Tab = 9,
  /**
   * The `\n` character.
   */
  LineFeed = 10,
  /**
   * The `\r` character.
   */
  CarriageReturn = 13,
  Space = 32,
  /**
   * The `!` character.
   */
  ExclamationMark = 33,
  /**
   * The `"` character.
   */
  DoubleQuote = 34,
  /**
   * The `#` character.
   */
  Hash = 35,
  /**
   * The `$` character.
   */
  DollarSign = 36,
  /**
   * The `%` character.
   */
  PercentSign = 37,
  /**
   * The `&` character.
   */
  Ampersand = 38,
  /**
   * The `'` character.
   */
  SingleQuote = 39,
  /**
   * The `(` character.
   */
  OpenParen = 40,
  /**
   * The `)` character.
   */
  CloseParen = 41,
  /**
   * The `*` character.
   */
  Asterisk = 42,
  /**
   * The `+` character.
   */
  Plus = 43,
  /**
   * The `,` character.
   */
  Comma = 44,
  /**
   * The `-` character.
   */
  Dash = 45,
  /**
   * The `.` character.
   */
  Period = 46,
  /**
   * The `/` character.
   */
  Slash = 47,

  Digit0 = 48,
  Digit1 = 49,
  Digit2 = 50,
  Digit3 = 51,
  Digit4 = 52,
  Digit5 = 53,
  Digit6 = 54,
  Digit7 = 55,
  Digit8 = 56,
  Digit9 = 57,

  /**
   * The `:` character.
   */
  Colon = 58,
  /**
   * The `;` character.
   */
  Semicolon = 59,
  /**
   * The `<` character.
   */
  LessThan = 60,
  /**
   * The `=` character.
   */
  Equals = 61,
  /**
   * The `>` character.
   */
  GreaterThan = 62,
  /**
   * The `?` character.
   */
  QuestionMark = 63,
  /**
   * The `@` character.
   */
  AtSign = 64,

  A = 65,
  B = 66,
  C = 67,
  D = 68,
  E = 69,
  F = 70,
  G = 71,
  H = 72,
  I = 73,
  J = 74,
  K = 75,
  L = 76,
  M = 77,
  N = 78,
  O = 79,
  P = 80,
  Q = 81,
  R = 82,
  S = 83,
  T = 84,
  U = 85,
  V = 86,
  W = 87,
  X = 88,
  Y = 89,
  Z = 90,

  /**
   * The `[` character.
   */
  OpenSquareBracket = 91,
  /**
   * The `\` character.
   */
  Backslash = 92,
  /**
   * The `]` character.
   */
  CloseSquareBracket = 93,
  /**
   * The `^` character.
   */
  Caret = 94,
  /**
   * The `_` character.
   */
  Underline = 95,
  /**
   * The ``(`)`` character.
   */
  BackTick = 96,

  a = 97,
  b = 98,
  c = 99,
  d = 100,
  e = 101,
  f = 102,
  g = 103,
  h = 104,
  i = 105,
  j = 106,
  k = 107,
  l = 108,
  m = 109,
  n = 110,
  o = 111,
  p = 112,
  q = 113,
  r = 114,
  s = 115,
  t = 116,
  u = 117,
  v = 118,
  w = 119,
  x = 120,
  y = 121,
  z = 122,

  /**
   * The `{` character.
   */
  OpenCurlyBrace = 123,
  /**
   * The `|` character.
   */
  Pipe = 124,
  /**
   * The `}` character.
   */
  CloseCurlyBrace = 125,
  /**
   * The `~` character.
   */
  Tilde = 126,

  /**
   * The &nbsp; (no-break space) character.
   * Unicode Character 'NO-BREAK SPACE' (U+00A0)
   */
  NoBreakSpace = 160,

  U_Combining_Grave_Accent = 0x03_00, //	U+0300	Combining Grave Accent
  U_Combining_Acute_Accent = 0x03_01, //	U+0301	Combining Acute Accent
  U_Combining_Circumflex_Accent = 0x03_02, //	U+0302	Combining Circumflex Accent
  U_Combining_Tilde = 0x03_03, //	U+0303	Combining Tilde
  U_Combining_Macron = 0x03_04, //	U+0304	Combining Macron
  U_Combining_Overline = 0x03_05, //	U+0305	Combining Overline
  U_Combining_Breve = 0x03_06, //	U+0306	Combining Breve
  U_Combining_Dot_Above = 0x03_07, //	U+0307	Combining Dot Above
  U_Combining_Diaeresis = 0x03_08, //	U+0308	Combining Diaeresis
  U_Combining_Hook_Above = 0x03_09, //	U+0309	Combining Hook Above
  U_Combining_Ring_Above = 0x03_0a, //	U+030A	Combining Ring Above
  U_Combining_Double_Acute_Accent = 0x03_0b, //	U+030B	Combining Double Acute Accent
  U_Combining_Caron = 0x03_0c, //	U+030C	Combining Caron
  U_Combining_Vertical_Line_Above = 0x03_0d, //	U+030D	Combining Vertical Line Above
  U_Combining_Double_Vertical_Line_Above = 0x03_0e, //	U+030E	Combining Double Vertical Line Above
  U_Combining_Double_Grave_Accent = 0x03_0f, //	U+030F	Combining Double Grave Accent
  U_Combining_Candrabindu = 0x03_10, //	U+0310	Combining Candrabindu
  U_Combining_Inverted_Breve = 0x03_11, //	U+0311	Combining Inverted Breve
  U_Combining_Turned_Comma_Above = 0x03_12, //	U+0312	Combining Turned Comma Above
  U_Combining_Comma_Above = 0x03_13, //	U+0313	Combining Comma Above
  U_Combining_Reversed_Comma_Above = 0x03_14, //	U+0314	Combining Reversed Comma Above
  U_Combining_Comma_Above_Right = 0x03_15, //	U+0315	Combining Comma Above Right
  U_Combining_Grave_Accent_Below = 0x03_16, //	U+0316	Combining Grave Accent Below
  U_Combining_Acute_Accent_Below = 0x03_17, //	U+0317	Combining Acute Accent Below
  U_Combining_Left_Tack_Below = 0x03_18, //	U+0318	Combining Left Tack Below
  U_Combining_Right_Tack_Below = 0x03_19, //	U+0319	Combining Right Tack Below
  U_Combining_Left_Angle_Above = 0x03_1a, //	U+031A	Combining Left Angle Above
  U_Combining_Horn = 0x03_1b, //	U+031B	Combining Horn
  U_Combining_Left_Half_Ring_Below = 0x03_1c, //	U+031C	Combining Left Half Ring Below
  U_Combining_Up_Tack_Below = 0x03_1d, //	U+031D	Combining Up Tack Below
  U_Combining_Down_Tack_Below = 0x03_1e, //	U+031E	Combining Down Tack Below
  U_Combining_Plus_Sign_Below = 0x03_1f, //	U+031F	Combining Plus Sign Below
  U_Combining_Minus_Sign_Below = 0x03_20, //	U+0320	Combining Minus Sign Below
  U_Combining_Palatalized_Hook_Below = 0x03_21, //	U+0321	Combining Palatalized Hook Below
  U_Combining_Retroflex_Hook_Below = 0x03_22, //	U+0322	Combining Retroflex Hook Below
  U_Combining_Dot_Below = 0x03_23, //	U+0323	Combining Dot Below
  U_Combining_Diaeresis_Below = 0x03_24, //	U+0324	Combining Diaeresis Below
  U_Combining_Ring_Below = 0x03_25, //	U+0325	Combining Ring Below
  U_Combining_Comma_Below = 0x03_26, //	U+0326	Combining Comma Below
  U_Combining_Cedilla = 0x03_27, //	U+0327	Combining Cedilla
  U_Combining_Ogonek = 0x03_28, //	U+0328	Combining Ogonek
  U_Combining_Vertical_Line_Below = 0x03_29, //	U+0329	Combining Vertical Line Below
  U_Combining_Bridge_Below = 0x03_2a, //	U+032A	Combining Bridge Below
  U_Combining_Inverted_Double_Arch_Below = 0x03_2b, //	U+032B	Combining Inverted Double Arch Below
  U_Combining_Caron_Below = 0x03_2c, //	U+032C	Combining Caron Below
  U_Combining_Circumflex_Accent_Below = 0x03_2d, //	U+032D	Combining Circumflex Accent Below
  U_Combining_Breve_Below = 0x03_2e, //	U+032E	Combining Breve Below
  U_Combining_Inverted_Breve_Below = 0x03_2f, //	U+032F	Combining Inverted Breve Below
  U_Combining_Tilde_Below = 0x03_30, //	U+0330	Combining Tilde Below
  U_Combining_Macron_Below = 0x03_31, //	U+0331	Combining Macron Below
  U_Combining_Low_Line = 0x03_32, //	U+0332	Combining Low Line
  U_Combining_Double_Low_Line = 0x03_33, //	U+0333	Combining Double Low Line
  U_Combining_Tilde_Overlay = 0x03_34, //	U+0334	Combining Tilde Overlay
  U_Combining_Short_Stroke_Overlay = 0x03_35, //	U+0335	Combining Short Stroke Overlay
  U_Combining_Long_Stroke_Overlay = 0x03_36, //	U+0336	Combining Long Stroke Overlay
  U_Combining_Short_Solidus_Overlay = 0x03_37, //	U+0337	Combining Short Solidus Overlay
  U_Combining_Long_Solidus_Overlay = 0x03_38, //	U+0338	Combining Long Solidus Overlay
  U_Combining_Right_Half_Ring_Below = 0x03_39, //	U+0339	Combining Right Half Ring Below
  U_Combining_Inverted_Bridge_Below = 0x03_3a, //	U+033A	Combining Inverted Bridge Below
  U_Combining_Square_Below = 0x03_3b, //	U+033B	Combining Square Below
  U_Combining_Seagull_Below = 0x03_3c, //	U+033C	Combining Seagull Below
  U_Combining_X_Above = 0x03_3d, //	U+033D	Combining X Above
  U_Combining_Vertical_Tilde = 0x03_3e, //	U+033E	Combining Vertical Tilde
  U_Combining_Double_Overline = 0x03_3f, //	U+033F	Combining Double Overline
  U_Combining_Grave_Tone_Mark = 0x03_40, //	U+0340	Combining Grave Tone Mark
  U_Combining_Acute_Tone_Mark = 0x03_41, //	U+0341	Combining Acute Tone Mark
  U_Combining_Greek_Perispomeni = 0x03_42, //	U+0342	Combining Greek Perispomeni
  U_Combining_Greek_Koronis = 0x03_43, //	U+0343	Combining Greek Koronis
  U_Combining_Greek_Dialytika_Tonos = 0x03_44, //	U+0344	Combining Greek Dialytika Tonos
  U_Combining_Greek_Ypogegrammeni = 0x03_45, //	U+0345	Combining Greek Ypogegrammeni
  U_Combining_Bridge_Above = 0x03_46, //	U+0346	Combining Bridge Above
  U_Combining_Equals_Sign_Below = 0x03_47, //	U+0347	Combining Equals Sign Below
  U_Combining_Double_Vertical_Line_Below = 0x03_48, //	U+0348	Combining Double Vertical Line Below
  U_Combining_Left_Angle_Below = 0x03_49, //	U+0349	Combining Left Angle Below
  U_Combining_Not_Tilde_Above = 0x03_4a, //	U+034A	Combining Not Tilde Above
  U_Combining_Homothetic_Above = 0x03_4b, //	U+034B	Combining Homothetic Above
  U_Combining_Almost_Equal_To_Above = 0x03_4c, //	U+034C	Combining Almost Equal To Above
  U_Combining_Left_Right_Arrow_Below = 0x03_4d, //	U+034D	Combining Left Right Arrow Below
  U_Combining_Upwards_Arrow_Below = 0x03_4e, //	U+034E	Combining Upwards Arrow Below
  U_Combining_Grapheme_Joiner = 0x03_4f, //	U+034F	Combining Grapheme Joiner
  U_Combining_Right_Arrowhead_Above = 0x03_50, //	U+0350	Combining Right Arrowhead Above
  U_Combining_Left_Half_Ring_Above = 0x03_51, //	U+0351	Combining Left Half Ring Above
  U_Combining_Fermata = 0x03_52, //	U+0352	Combining Fermata
  U_Combining_X_Below = 0x03_53, //	U+0353	Combining X Below
  U_Combining_Left_Arrowhead_Below = 0x03_54, //	U+0354	Combining Left Arrowhead Below
  U_Combining_Right_Arrowhead_Below = 0x03_55, //	U+0355	Combining Right Arrowhead Below
  U_Combining_Right_Arrowhead_And_Up_Arrowhead_Below = 0x03_56, //	U+0356	Combining Right Arrowhead And Up Arrowhead Below
  U_Combining_Right_Half_Ring_Above = 0x03_57, //	U+0357	Combining Right Half Ring Above
  U_Combining_Dot_Above_Right = 0x03_58, //	U+0358	Combining Dot Above Right
  U_Combining_Asterisk_Below = 0x03_59, //	U+0359	Combining Asterisk Below
  U_Combining_Double_Ring_Below = 0x03_5a, //	U+035A	Combining Double Ring Below
  U_Combining_Zigzag_Above = 0x03_5b, //	U+035B	Combining Zigzag Above
  U_Combining_Double_Breve_Below = 0x03_5c, //	U+035C	Combining Double Breve Below
  U_Combining_Double_Breve = 0x03_5d, //	U+035D	Combining Double Breve
  U_Combining_Double_Macron = 0x03_5e, //	U+035E	Combining Double Macron
  U_Combining_Double_Macron_Below = 0x03_5f, //	U+035F	Combining Double Macron Below
  U_Combining_Double_Tilde = 0x03_60, //	U+0360	Combining Double Tilde
  U_Combining_Double_Inverted_Breve = 0x03_61, //	U+0361	Combining Double Inverted Breve
  U_Combining_Double_Rightwards_Arrow_Below = 0x03_62, //	U+0362	Combining Double Rightwards Arrow Below
  U_Combining_Latin_Small_Letter_A = 0x03_63, //	U+0363	Combining Latin Small Letter A
  U_Combining_Latin_Small_Letter_E = 0x03_64, //	U+0364	Combining Latin Small Letter E
  U_Combining_Latin_Small_Letter_I = 0x03_65, //	U+0365	Combining Latin Small Letter I
  U_Combining_Latin_Small_Letter_O = 0x03_66, //	U+0366	Combining Latin Small Letter O
  U_Combining_Latin_Small_Letter_U = 0x03_67, //	U+0367	Combining Latin Small Letter U
  U_Combining_Latin_Small_Letter_C = 0x03_68, //	U+0368	Combining Latin Small Letter C
  U_Combining_Latin_Small_Letter_D = 0x03_69, //	U+0369	Combining Latin Small Letter D
  U_Combining_Latin_Small_Letter_H = 0x03_6a, //	U+036A	Combining Latin Small Letter H
  U_Combining_Latin_Small_Letter_M = 0x03_6b, //	U+036B	Combining Latin Small Letter M
  U_Combining_Latin_Small_Letter_R = 0x03_6c, //	U+036C	Combining Latin Small Letter R
  U_Combining_Latin_Small_Letter_T = 0x03_6d, //	U+036D	Combining Latin Small Letter T
  U_Combining_Latin_Small_Letter_V = 0x03_6e, //	U+036E	Combining Latin Small Letter V
  U_Combining_Latin_Small_Letter_X = 0x03_6f, //	U+036F	Combining Latin Small Letter X

  /**
   * Unicode Character 'LINE SEPARATOR' (U+2028)
   * http://www.fileformat.info/info/unicode/char/2028/index.htm
   */
  LINE_SEPARATOR = 0x20_28,
  /**
   * Unicode Character 'PARAGRAPH SEPARATOR' (U+2029)
   * http://www.fileformat.info/info/unicode/char/2029/index.htm
   */
  PARAGRAPH_SEPARATOR = 0x20_29,
  /**
   * Unicode Character 'NEXT LINE' (U+0085)
   * http://www.fileformat.info/info/unicode/char/0085/index.htm
   */
  NEXT_LINE = 0x00_85,

  // http://www.fileformat.info/info/unicode/category/Sk/list.htm
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  U_CIRCUMFLEX = 0x00_5e, // U+005E	CIRCUMFLEX
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  U_GRAVE_ACCENT = 0x00_60, // U+0060	GRAVE ACCENT
  U_DIAERESIS = 0x00_a8, // U+00A8	DIAERESIS
  U_MACRON = 0x00_af, // U+00AF	MACRON
  U_ACUTE_ACCENT = 0x00_b4, // U+00B4	ACUTE ACCENT
  U_CEDILLA = 0x00_b8, // U+00B8	CEDILLA
  U_MODIFIER_LETTER_LEFT_ARROWHEAD = 0x02_c2, // U+02C2	MODIFIER LETTER LEFT ARROWHEAD
  U_MODIFIER_LETTER_RIGHT_ARROWHEAD = 0x02_c3, // U+02C3	MODIFIER LETTER RIGHT ARROWHEAD
  U_MODIFIER_LETTER_UP_ARROWHEAD = 0x02_c4, // U+02C4	MODIFIER LETTER UP ARROWHEAD
  U_MODIFIER_LETTER_DOWN_ARROWHEAD = 0x02_c5, // U+02C5	MODIFIER LETTER DOWN ARROWHEAD
  U_MODIFIER_LETTER_CENTRED_RIGHT_HALF_RING = 0x02_d2, // U+02D2	MODIFIER LETTER CENTRED RIGHT HALF RING
  U_MODIFIER_LETTER_CENTRED_LEFT_HALF_RING = 0x02_d3, // U+02D3	MODIFIER LETTER CENTRED LEFT HALF RING
  U_MODIFIER_LETTER_UP_TACK = 0x02_d4, // U+02D4	MODIFIER LETTER UP TACK
  U_MODIFIER_LETTER_DOWN_TACK = 0x02_d5, // U+02D5	MODIFIER LETTER DOWN TACK
  U_MODIFIER_LETTER_PLUS_SIGN = 0x02_d6, // U+02D6	MODIFIER LETTER PLUS SIGN
  U_MODIFIER_LETTER_MINUS_SIGN = 0x02_d7, // U+02D7	MODIFIER LETTER MINUS SIGN
  U_BREVE = 0x02_d8, // U+02D8	BREVE
  U_DOT_ABOVE = 0x02_d9, // U+02D9	DOT ABOVE
  U_RING_ABOVE = 0x02_da, // U+02DA	RING ABOVE
  U_OGONEK = 0x02_db, // U+02DB	OGONEK
  U_SMALL_TILDE = 0x02_dc, // U+02DC	SMALL TILDE
  U_DOUBLE_ACUTE_ACCENT = 0x02_dd, // U+02DD	DOUBLE ACUTE ACCENT
  U_MODIFIER_LETTER_RHOTIC_HOOK = 0x02_de, // U+02DE	MODIFIER LETTER RHOTIC HOOK
  U_MODIFIER_LETTER_CROSS_ACCENT = 0x02_df, // U+02DF	MODIFIER LETTER CROSS ACCENT
  U_MODIFIER_LETTER_EXTRA_HIGH_TONE_BAR = 0x02_e5, // U+02E5	MODIFIER LETTER EXTRA-HIGH TONE BAR
  U_MODIFIER_LETTER_HIGH_TONE_BAR = 0x02_e6, // U+02E6	MODIFIER LETTER HIGH TONE BAR
  U_MODIFIER_LETTER_MID_TONE_BAR = 0x02_e7, // U+02E7	MODIFIER LETTER MID TONE BAR
  U_MODIFIER_LETTER_LOW_TONE_BAR = 0x02_e8, // U+02E8	MODIFIER LETTER LOW TONE BAR
  U_MODIFIER_LETTER_EXTRA_LOW_TONE_BAR = 0x02_e9, // U+02E9	MODIFIER LETTER EXTRA-LOW TONE BAR
  U_MODIFIER_LETTER_YIN_DEPARTING_TONE_MARK = 0x02_ea, // U+02EA	MODIFIER LETTER YIN DEPARTING TONE MARK
  U_MODIFIER_LETTER_YANG_DEPARTING_TONE_MARK = 0x02_eb, // U+02EB	MODIFIER LETTER YANG DEPARTING TONE MARK
  U_MODIFIER_LETTER_UNASPIRATED = 0x02_ed, // U+02ED	MODIFIER LETTER UNASPIRATED
  U_MODIFIER_LETTER_LOW_DOWN_ARROWHEAD = 0x02_ef, // U+02EF	MODIFIER LETTER LOW DOWN ARROWHEAD
  U_MODIFIER_LETTER_LOW_UP_ARROWHEAD = 0x02_f0, // U+02F0	MODIFIER LETTER LOW UP ARROWHEAD
  U_MODIFIER_LETTER_LOW_LEFT_ARROWHEAD = 0x02_f1, // U+02F1	MODIFIER LETTER LOW LEFT ARROWHEAD
  U_MODIFIER_LETTER_LOW_RIGHT_ARROWHEAD = 0x02_f2, // U+02F2	MODIFIER LETTER LOW RIGHT ARROWHEAD
  U_MODIFIER_LETTER_LOW_RING = 0x02_f3, // U+02F3	MODIFIER LETTER LOW RING
  U_MODIFIER_LETTER_MIDDLE_GRAVE_ACCENT = 0x02_f4, // U+02F4	MODIFIER LETTER MIDDLE GRAVE ACCENT
  U_MODIFIER_LETTER_MIDDLE_DOUBLE_GRAVE_ACCENT = 0x02_f5, // U+02F5	MODIFIER LETTER MIDDLE DOUBLE GRAVE ACCENT
  U_MODIFIER_LETTER_MIDDLE_DOUBLE_ACUTE_ACCENT = 0x02_f6, // U+02F6	MODIFIER LETTER MIDDLE DOUBLE ACUTE ACCENT
  U_MODIFIER_LETTER_LOW_TILDE = 0x02_f7, // U+02F7	MODIFIER LETTER LOW TILDE
  U_MODIFIER_LETTER_RAISED_COLON = 0x02_f8, // U+02F8	MODIFIER LETTER RAISED COLON
  U_MODIFIER_LETTER_BEGIN_HIGH_TONE = 0x02_f9, // U+02F9	MODIFIER LETTER BEGIN HIGH TONE
  U_MODIFIER_LETTER_END_HIGH_TONE = 0x02_fa, // U+02FA	MODIFIER LETTER END HIGH TONE
  U_MODIFIER_LETTER_BEGIN_LOW_TONE = 0x02_fb, // U+02FB	MODIFIER LETTER BEGIN LOW TONE
  U_MODIFIER_LETTER_END_LOW_TONE = 0x02_fc, // U+02FC	MODIFIER LETTER END LOW TONE
  U_MODIFIER_LETTER_SHELF = 0x02_fd, // U+02FD	MODIFIER LETTER SHELF
  U_MODIFIER_LETTER_OPEN_SHELF = 0x02_fe, // U+02FE	MODIFIER LETTER OPEN SHELF
  U_MODIFIER_LETTER_LOW_LEFT_ARROW = 0x02_ff, // U+02FF	MODIFIER LETTER LOW LEFT ARROW
  U_GREEK_LOWER_NUMERAL_SIGN = 0x03_75, // U+0375	GREEK LOWER NUMERAL SIGN
  U_GREEK_TONOS = 0x03_84, // U+0384	GREEK TONOS
  U_GREEK_DIALYTIKA_TONOS = 0x03_85, // U+0385	GREEK DIALYTIKA TONOS
  U_GREEK_KORONIS = 0x1f_bd, // U+1FBD	GREEK KORONIS
  U_GREEK_PSILI = 0x1f_bf, // U+1FBF	GREEK PSILI
  U_GREEK_PERISPOMENI = 0x1f_c0, // U+1FC0	GREEK PERISPOMENI
  U_GREEK_DIALYTIKA_AND_PERISPOMENI = 0x1f_c1, // U+1FC1	GREEK DIALYTIKA AND PERISPOMENI
  U_GREEK_PSILI_AND_VARIA = 0x1f_cd, // U+1FCD	GREEK PSILI AND VARIA
  U_GREEK_PSILI_AND_OXIA = 0x1f_ce, // U+1FCE	GREEK PSILI AND OXIA
  U_GREEK_PSILI_AND_PERISPOMENI = 0x1f_cf, // U+1FCF	GREEK PSILI AND PERISPOMENI
  U_GREEK_DASIA_AND_VARIA = 0x1f_dd, // U+1FDD	GREEK DASIA AND VARIA
  U_GREEK_DASIA_AND_OXIA = 0x1f_de, // U+1FDE	GREEK DASIA AND OXIA
  U_GREEK_DASIA_AND_PERISPOMENI = 0x1f_df, // U+1FDF	GREEK DASIA AND PERISPOMENI
  U_GREEK_DIALYTIKA_AND_VARIA = 0x1f_ed, // U+1FED	GREEK DIALYTIKA AND VARIA
  U_GREEK_DIALYTIKA_AND_OXIA = 0x1f_ee, // U+1FEE	GREEK DIALYTIKA AND OXIA
  U_GREEK_VARIA = 0x1f_ef, // U+1FEF	GREEK VARIA
  U_GREEK_OXIA = 0x1f_fd, // U+1FFD	GREEK OXIA
  U_GREEK_DASIA = 0x1f_fe, // U+1FFE	GREEK DASIA

  U_IDEOGRAPHIC_FULL_STOP = 0x30_02, // U+3002	IDEOGRAPHIC FULL STOP
  U_LEFT_CORNER_BRACKET = 0x30_0c, // U+300C	LEFT CORNER BRACKET
  U_RIGHT_CORNER_BRACKET = 0x30_0d, // U+300D	RIGHT CORNER BRACKET
  U_LEFT_BLACK_LENTICULAR_BRACKET = 0x30_10, // U+3010	LEFT BLACK LENTICULAR BRACKET
  U_RIGHT_BLACK_LENTICULAR_BRACKET = 0x30_11, // U+3011	RIGHT BLACK LENTICULAR BRACKET

  U_OVERLINE = 0x20_3e, // Unicode Character 'OVERLINE'

  /**
   * UTF-8 BOM
   * Unicode Character 'ZERO WIDTH NO-BREAK SPACE' (U+FEFF)
   * http://www.fileformat.info/info/unicode/char/feff/index.htm
   */
  UTF8_BOM = 65_279,

  U_FULLWIDTH_SEMICOLON = 0xff_1b, // U+FF1B	FULLWIDTH SEMICOLON
  U_FULLWIDTH_COMMA = 0xff_0c, // U+FF0C	FULLWIDTH COMMA
}
