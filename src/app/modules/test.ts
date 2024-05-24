import Walker, { Entry } from 'folder-walker';

const rootDir = process.cwd();
const appDir = `${rootDir}/src/app/modules`;
const stream = Walker([appDir], {
  filter: (filename: string) => filename.endsWith('.ts'),
  maxDepth: 1,
});
const res: Omit<Entry, 'stat'>[] = [];
stream.on('data', (item: Entry) => {
  const { basename, relname, type, root, filepath } = item;
  res.push({ basename, relname, type, root, filepath });
});
stream.on('end', () => {
  const result = Object.groupBy(res, ({ type }) => type);
  // console.log('[DEBUG][DzungDang] result:', result);
});
