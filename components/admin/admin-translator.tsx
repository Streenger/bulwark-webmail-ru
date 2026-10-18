'use client';

import { useEffect } from 'react';
import { isAdminRussian, translateAdminText, translateAdminTextPreserving } from '@/lib/admin/i18n/translate';

const ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'] as const;
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'NOSCRIPT']);

function translateTextNode(node: Text): void {
  const parent = node.parentElement;
  if (!parent || SKIP_TAGS.has(parent.tagName)) return;
  const original = node.nodeValue ?? '';
  const next = translateAdminTextPreserving(original);
  if (next !== original) node.nodeValue = next;
}

function translateAttributes(element: Element): void {
  for (const name of ATTRIBUTES) {
    const value = element.getAttribute(name);
    if (!value) continue;
    const translated = translateAdminText(value);
    if (translated !== null && translated !== value) element.setAttribute(name, translated);
  }
}

function translateTree(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const element = root as Element;
  if (SKIP_TAGS.has(element.tagName)) return;
  translateAttributes(element);
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text);
    else if (!SKIP_TAGS.has((node as Element).tagName)) translateAttributes(node as Element);
    node = walker.nextNode();
  }
}

/**
 * Переводит панель администратора на русский, когда язык страницы русский.
 * Следит за изменениями страницы и переводит появляющиеся тексты, а также
 * сообщения диалогов confirm и alert.
 */
export function AdminTranslator() {
  useEffect(() => {
    if (!isAdminRussian()) return;

    const originalConfirm = window.confirm.bind(window);
    const originalAlert = window.alert.bind(window);
    window.confirm = (message?: string) => originalConfirm(translateAdminTextPreserving(message ?? ''));
    window.alert = (message?: unknown) => originalAlert(translateAdminTextPreserving(String(message ?? '')));

    document.title = translateAdminTextPreserving(document.title);
    translateTree(document.body);

    const OBSERVE_OPTIONS: MutationObserverInit = {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRIBUTES],
    };

    const observer = new MutationObserver((mutations) => {
      observer.disconnect();
      try {
        for (const mutation of mutations) {
          if (mutation.type === 'characterData') translateTree(mutation.target);
          else if (mutation.type === 'attributes') translateAttributes(mutation.target as Element);
          else mutation.addedNodes.forEach((added) => translateTree(added));
        }
      } finally {
        observer.observe(document.body, OBSERVE_OPTIONS);
      }
    });
    observer.observe(document.body, OBSERVE_OPTIONS);

    return () => {
      observer.disconnect();
      window.confirm = originalConfirm;
      window.alert = originalAlert;
    };
  }, []);

  return null;
}
