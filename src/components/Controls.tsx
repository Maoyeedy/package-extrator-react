import { type TranslationKey } from '../translations';

interface ControlsProps {
  t: (key: TranslationKey, ...args: string[]) => string;
  excludeMeta: boolean;
  categorizeByExtension: boolean;
  maintainStructure: boolean;
  enablePreview: boolean;
  showFileSize: boolean;
  onExcludeMetaChange: (value: boolean) => void;
  onCategorizeByExtensionChange: (value: boolean) => void;
  onMaintainStructureChange: (value: boolean) => void;
  onEnablePreviewChange: (value: boolean) => void;
  onShowFileSizeChange: (value: boolean) => void;
}

export function Controls({
  t,
  excludeMeta,
  categorizeByExtension,
  maintainStructure,
  enablePreview,
  showFileSize,
  onExcludeMetaChange,
  onCategorizeByExtensionChange,
  onMaintainStructureChange,
  onEnablePreviewChange,
  onShowFileSizeChange,
}: ControlsProps) {
  return (
    <div className="controls">
      <Checkbox
        id="excludeMeta"
        checked={excludeMeta}
        onChange={onExcludeMetaChange}
        label={t('excludeMeta')}
      />
      <Checkbox
        id="categorizeByExtension"
        checked={categorizeByExtension}
        onChange={onCategorizeByExtensionChange}
        label={t('categorizeByExtension')}
      />
      <Checkbox
        id="maintainStructure"
        checked={maintainStructure}
        onChange={onMaintainStructureChange}
        label={t('maintainStructure')}
      />
      <Checkbox
        id="enablePreview"
        checked={enablePreview}
        onChange={onEnablePreviewChange}
        label={t('enablePreview')}
      />
      <Checkbox
        id="showFileSize"
        checked={showFileSize}
        onChange={onShowFileSizeChange}
        label={t('showFileSize')}
      />
    </div>
  );
}

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

function Checkbox({ id, checked, onChange, label }: CheckboxProps) {
  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
