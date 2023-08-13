// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const React = require('react');
const ReactDOM = require('react-dom');
const { shell } = require('electron');

const { openExternal } = shell;

const template = [
  {
    label: 'App',
    submenu: [
      {
        label: 'Disabled',
        enabled: false,
      },
      {
        label: 'Not Visiable',
        visiable: false,
      },
      {
        label: 'Arguments',
        click: (item, e) => console.log(item, e),
      },
      { type: 'separator' },
      {
        label: 'Checkbox',
        type: 'checkbox',
        checked: true,
        click: (item, e) => console.log(item),
      },
      {
        label: 'Quit',
        click: () => {
          window.close();
        },
      },
    ],
  },
  {
    label: 'Color',
    submenu: [
      {
        label: 'Light',
        type: 'radio',
        checked: false,
        click: (item, e) => {},
      },
      {
        label: 'Dark',
        type: 'radio',
        checked: true,
        click: (item, e) => {},
      },
      {
        label: 'Black',
        type: 'radio',
        checked: false,
        click: (item, e) => {},
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Homepage',
        click: () => {
          openExternal(
            'https://github.com/KochiyaOcean/electron-react-titlebar'
          );
        },
      },
    ],
  },
];

export default template;
