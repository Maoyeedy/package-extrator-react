import { type TranslationKey } from '../translations';

interface HeaderProps {
  t: (key: TranslationKey, ...args: string[]) => string;
}

export function Header({ t }: HeaderProps) {
  return (
    <header>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <p>
        {t('repository')}{' '}
        <a
          href="https://github.com/peraperavrc/package-extractor"
          target="_blank"
          rel="noopener noreferrer"
        >
          peraperavrc/package-extractor
        </a>
      </p>
      <p>
        {t('creator')}{' '}
        <a
          href="https://x.com/peraperavrc"
          target="_blank"
          rel="noopener noreferrer"
        >
          @peraperavrc
        </a>
      </p>
    </header>
  );
}
