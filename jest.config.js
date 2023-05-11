// module.exports = {
//   "transform": { "^.+\\.tsx$": "ts-jest", "^.+\\.ts$": "ts-jest" }
// }
const config = {
  testEnvironment: 'jsdom',
  roots: ['src'],
};
module.exports = config;