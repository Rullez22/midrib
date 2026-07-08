"use client";

import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  UploadArrowIcon,
  UploadEditIcon,
  UploadDeleteIcon,
  UploadPauseIcon,
} from "./upload-icons";

/**
 * UploadV2 — широкая drop-зона прикрепления документов MIDHUB DS.
 * Источник: Figma «UI Контролы» / Upload var 2 (node 1520:62781). Стили 1:1.
 *
 * Пунктирная область на всю ширину: иконка-загрузка + подсказка.
 *   hover/active/focus — псевдосостояния (CSS).
 *   disabled — серая палитра; error — красная рамка + сообщение об ошибке.
 * Перетаскивание не обрабатывается внутри — повесьте onDragOver/onDrop через props.
 *
 * @example
 *   <UploadV2 onSelect={pick} onDrop={handleDrop} onDragOver={prevent} />
 *   <UploadV2 error onSelect={pick} />
 *   <UploadV2 disabled />
 */

export interface UploadV2Props
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Выключена. */
  disabled?: boolean;
  /** Состояние ошибки — красная рамка и сообщение. */
  error?: boolean;
  /** Текст ошибки (по умолчанию — стандартное сообщение). */
  errorText?: ReactNode;
  /** Клик по зоне (открыть выбор файла). */
  onSelect?: () => void;
}

export const UploadV2 = forwardRef<HTMLButtonElement, UploadV2Props>(
  function UploadV2(
    { disabled = false, error = false, errorText, onSelect, className, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "ds-upload-v2",
          disabled && "ds-upload-v2--disabled",
          error && "ds-upload-v2--error",
          className,
        )}
        onClick={onSelect}
        disabled={disabled}
        {...rest}
      >
        <span className="ds-upload-v2__icon">
          <UploadArrowIcon />
        </span>
        {error ? (
          <span className="ds-upload-v2__text">
            {errorText ?? (
              <>
                Ошибка при загрузке файла.
                <br />
                Пожалуйста, попробуйте еще раз.
              </>
            )}
          </span>
        ) : (
          <span className="ds-upload-v2__text">
            Выберете документы на <span className="ds-upload-v2__accent">компьютере</span>
            <br />
            или перетащите в эту область
            <span className="ds-upload-v2__hint">(Максимальный размер файла до 50 МБ)</span>
          </span>
        )}
      </button>
    );
  },
);

/**
 * UploadFile — строка прикреплённого файла MIDHUB DS.
 * Источник: Figma «UI Контролы» / Upload var 2 → File / loading file. Стили 1:1.
 *
 *   progress (0–100) задан → режим загрузки: серая заливка-прогресс,
 *                            «Загружено N%», кнопка паузы.
 *   progress не задан      → готово: мета-строка, «карандаш» (правка).
 *   Корзина — всегда (если задан onDelete).
 *
 * @example
 *   <UploadFile name="Документ" meta="PDF · 1 MB" onEdit={edit} onDelete={remove} />
 *   <UploadFile name="Документ" progress={75} onPause={pause} onDelete={remove} />
 */

export interface UploadFileProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Имя файла. */
  name: ReactNode;
  /** Мета-строка (например «PDF · 1 MB»). Игнорируется при заданном progress. */
  meta?: ReactNode;
  /** Прогресс загрузки 0–100 → режим загрузки. */
  progress?: number;
  /** Правка (режим «готово»). */
  onEdit?: () => void;
  /** Пауза (режим загрузки). */
  onPause?: () => void;
  /** Удаление файла. */
  onDelete?: () => void;
}

export const UploadFile = forwardRef<HTMLDivElement, UploadFileProps>(
  function UploadFile(
    { name, meta, progress, onEdit, onPause, onDelete, className, ...rest },
    ref,
  ) {
    const isLoading = progress != null;
    const pct = isLoading ? Math.min(100, Math.max(0, progress)) : 0;

    return (
      <div ref={ref} className={cn("ds-upload-file", className)} {...rest}>
        {isLoading && (
          <span className="ds-upload-file__progress" style={{ width: `${pct}%` }} aria-hidden />
        )}
        <div className="ds-upload-file__text">
          <span className="ds-upload-file__name">{name}</span>
          <span className="ds-upload-file__meta">
            {isLoading ? `Загружено ${Math.round(pct)}%` : meta}
          </span>
        </div>
        <div className="ds-upload-file__actions">
          {isLoading
            ? onPause && (
                <button
                  type="button"
                  className="ds-upload-file__action"
                  onClick={onPause}
                  aria-label="Приостановить загрузку"
                >
                  <UploadPauseIcon />
                </button>
              )
            : onEdit && (
                <button
                  type="button"
                  className="ds-upload-file__action"
                  onClick={onEdit}
                  aria-label="Изменить"
                >
                  <UploadEditIcon />
                </button>
              )}
          {onDelete && (
            <button
              type="button"
              className="ds-upload-file__action ds-upload-file__action--danger"
              onClick={onDelete}
              aria-label="Удалить файл"
            >
              <UploadDeleteIcon />
            </button>
          )}
        </div>
      </div>
    );
  },
);
