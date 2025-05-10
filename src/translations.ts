export const translations = {
  en: {
    title: "Package Extractor",
    description: "You can individually retrieve textures, model data, and other files within the .unitypackage extension from your browser. ",
    creator: "Created by ",
    repository: "Repository: ",
    dropZone: "Drag and drop .unitypackage here",
    excludeMeta: "Exclude .meta files",
    categorizeByExtension: "Categorize by file extension",
    maintainStructure: "Maintain file structure",
    enablePreview: "Enable texture preview",
    showFileSize: "Show file size",
    downloadAll: "Download All as ZIP",
    downloadCategory: "Download {0} as ZIP",
    errorMessage: "An error occurred while processing the package. Please check the console for details.",
    invalidFile: "Please drop a Unity package file (.unitypackage).",
    processing: "Processing..."
  },
  ja: {
    title: "開ける君",
    description: "ブラウザーから.unitypackageの拡張子の中にあるテクスチャやモデルデータを見ることができます。スクリプトはクライアントサイドのみ（自分のブラウザ）で動作します。",
    creator: "作成者: ",
    repository: "リポジトリ: ",
    dropZone: ".unitypackageをここにドラッグ＆ドロップしてください",
    excludeMeta: ".metaファイルを除外する",
    categorizeByExtension: "ファイル拡張子で分類する",
    maintainStructure: "ファイル構造を維持する",
    enablePreview: "テクスチャのプレビューを有効にする",
    showFileSize: "ファイルサイズを表示する",
    downloadAll: "すべてをZIPでダウンロード",
    downloadCategory: "{0}をZIPでダウンロード",
    errorMessage: "パッケージの処理中にエラーが発生しました。詳細はコンソールを確認してください。",
    invalidFile: "Unityパッケージファイル（.unitypackage）をドロップしてください。",
    processing: "処理中..."
  },
  ko: {
    title: "Package Extractor",
    description: "브라우저에서 .unitypackage 확장자 내의 텍스처, 모델 데이터 등을 개별적으로 가져올 수 있습니다. ",
    creator: "제작자: ",
    repository: "리포지토리: ",
    dropZone: ".unitypackage를 여기에 드래그 앤 드롭하세요",
    excludeMeta: ".meta 파일 제외",
    categorizeByExtension: "파일 확장자별로 분류",
    maintainStructure: "파일 구조 유지",
    enablePreview: "텍스처 미리보기 활성화",
    showFileSize: "파일 크기 표시",
    downloadAll: "모두 ZIP으로 다운로드",
    downloadCategory: "{0}을(를) ZIP으로 다운로드",
    errorMessage: "패키지 처리 중 오류가 발생했습니다. 자세한 내용은 콘솔을 확인하세요.",
    invalidFile: "Unity 패키지 파일(.unitypackage)을 드롭해주세요.",
    processing: "처리중..."
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
