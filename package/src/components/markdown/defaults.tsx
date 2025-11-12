/**
 * Default markdown components
 * These are used when no custom components are provided
 */

import type { Components } from 'react-markdown';
import H1 from './h1';
import H2 from './h2';
import H3 from './h3';
import H4 from './h4';
import H5 from './h5';
import H6 from './h6';
import P from './p';
import A from './a';
import Img from './img';
import Code from './code';
import Pre from './pre';
import Blockquote from './blockquote';
import Ul from './ul';
import Ol from './ol';
import Li from './li';
import Table from './table';
import Thead from './thead';
import Tbody from './tbody';
import Tr from './tr';
import Th from './th';
import Td from './td';
import Hr from './hr';
import Strong from './strong';
import Em from './em';

/**
 * Default markdown components that will be used if no custom components are provided
 * These components from the components/markdown folder will be used.
 * If a component is not provided here, Tailwind's prose classes will handle the styling.
 */
export const defaultMarkdownComponents: Partial<Components> = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  a: A,
  img: Img,
  code: Code,
  pre: Pre,
  blockquote: Blockquote,
  ul: Ul,
  ol: Ol,
  li: Li,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  hr: Hr,
  strong: Strong,
  em: Em,
};

