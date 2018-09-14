import _ from 'lodash';

export const httpGetAnimals = (filter) => (new Promise((resolve) => (setTimeout(() => resolve(_.concat(
  (filter !== 'real') ? [{
    name: 'unicorn',
    emoji: '🦄'
  }] : [],
  (filter !== 'magical') ? [{
    name: 'lion',
    emoji: '🦁'
  }, {
    name: 'cat',
    emoji: '🐈'
  }] : []
)), 1000))));

