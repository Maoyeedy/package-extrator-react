import { type Language, translations } from '../translations';

interface LanguageSelectProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelect({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectProps) {
  return (
    <div className="language-select">
      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => { onLanguageChange(e.target.value as Language); }}
      >
        {Object.keys(translations).map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
