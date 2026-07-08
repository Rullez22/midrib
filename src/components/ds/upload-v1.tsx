"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { UploadPlusIcon, UploadDeleteIcon, UploadLoaderIcon } from "./upload-icons";

/**
 * UploadV1 — компактная плитка прикрепления документа MIDHUB DS.
 * Источник: Figma «UI Контролы» / Upload var 1 (node 1508:62335). Стили 1:1.
 *
 * Квадрат 84×84. Поведение зависит от данных:
 *   пустая        — голубой фон + «плюс» (выбор файла по клику).
 *                   hover/active/focus — псевдосостояния (CSS).
 *   error         — красная палитра.
 *   disabled      — серая, некликабельна.
 *   loading       — спиннер (приоритетнее preview).
 *   preview       — миниатюра файла; при наведении (onDelete) — вуаль + корзина.
 *   count         — поверх миниатюры постоянная вуаль и «+N» (группа документов).
 *
 * @example
 *   <UploadV1 onSelect={pick} />
 *   <UploadV1 error onSelect={pick} />
 *   <UploadV1 loading />
 *   <UploadV1 preview={url} onDelete={remove} />
 *   <UploadV1 preview={url} count={2} onSelect={openGroup} />
 */

export interface UploadV1Props
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** URL миниатюры загруженного файла. Задано → плитка показывает превью. */
  preview?: string;
  /** Бейдж «+N» поверх миниатюры (сколько ещё документов в группе). */
  count?: number;
  /** Идёт загрузка — спиннер (перекрывает preview). */
  loading?: boolean;
  /** Состояние ошибки (красная палитра). */
  error?: boolean;
  /** Выключена. */
  disabled?: boolean;
  /** Клик по плитке (выбор/открытие). */
  onSelect?: () => void;
  /** Удаление файла — показывает корзину при наведении на миниатюру. */
  onDelete?: () => void;
  /** Подпись для скринридера. */
  label?: string;
}

export const UploadV1 = forwardRef<HTMLButtonElement, UploadV1Props>(
  function UploadV1(
    {
      preview,
      count,
      loading = false,
      error = false,
      disabled = false,
      onSelect,
      onDelete,
      label = "Прикрепить документ",
      className,
      ...rest
    },
    ref,
  ) {
    const hasPreview = !loading && preview != null;
    const hasCount = hasPreview && count != null && count > 0;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "ds-upload-v1",
          error && "ds-upload-v1--error",
          disabled && "ds-upload-v1--disabled",
          loading && "ds-upload-v1--loading",
          hasPreview && "ds-upload-v1--filled",
          className,
        )}
        onClick={onSelect}
        disabled={disabled || loading}
        aria-label={label}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading ? (
          <span className="ds-upload-v1__icon ds-upload-v1__spinner">
            <UploadLoaderIcon />
          </span>
        ) : hasPreview ? (
          <>
            <img className="ds-upload-v1__img" src={preview} alt="" />
            <span
              className={cn(
                "ds-upload-v1__overlay",
                hasCount && "ds-upload-v1__overlay--count",
              )}
            >
              {hasCount ? (
                <span className="ds-upload-v1__badge">+{count}</span>
              ) : (
                onDelete && (
                  <span
                    className="ds-upload-v1__delete"
                    role="button"
                    tabIndex={-1}
                    aria-label="Удалить документ"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <UploadDeleteIcon />
                  </span>
                )
              )}
            </span>
          </>
        ) : (
          <span className="ds-upload-v1__icon">
            <UploadPlusIcon />
          </span>
        )}
      </button>
    );
  },
);
