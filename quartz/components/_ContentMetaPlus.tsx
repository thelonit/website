import { formatDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/_ContentMetaPlus.scss"

interface ContentMetaOptions {

  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

// Mapping of status emojis to tooltip text
const statusTooltipMap: Record<string, string> = {
  "🌱": "وضعیت: نهال",
  "🌿": "وضعیت: درختچه",
  "🌳": "وضعیت: همیشه‌سبز",
  "❌": "وضعیت: ناقص",
  "🪦": "وضعیت: متروک",
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        const created = fileData.dates.created
        const modified = fileData.dates.modified

        // created
        if (created) {
          segments.push(
            <span title="تاریخ انتشار">
              📅 {formatDate(created, cfg.locale)}
            </span>
          )
        }

        // modified
        if (modified && created?.toDateString() !== modified.toDateString()) {
          segments.push(
            <span title="تاریخ آخرین بروزرسانی">
              🔄 {formatDate(modified, cfg.locale)}
            </span>
          )
        }
      }

      // reading time
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(displayedTime)
      }

      // word count
      if (fileData.wordCount !== undefined && fileData.frontmatter?.wordcount !== false) {
        segments.push(
          <span title="تعداد کلمات">
            {fileData.wordCount} کلمه
          </span>
        )
      }

      // status
      const status = fileData.frontmatter?.status || "نامشخص"
      if (status !== "نامشخص") {
        segments.push(
          <span title={statusTooltipMap[status] || status}>
            {status}
          </span>
        )
      }


      const segmentsElements = segments.map((segment, index) => <span key={index}>{segment}</span>)

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segmentsElements}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor


// Source: https://github.com/quantumgardener/qg.info/blob/v4/quartz/components/ContentMeta.tsx