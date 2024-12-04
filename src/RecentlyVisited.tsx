'use client'

import {useEffect, useState} from "react";
import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'

import type { RecentlyVisitedPluginOptions } from './'
import './RecentlyVisitedPlugin.css'

interface UserSettings {
  recentlyVisitedPlugin: {
    enabled: boolean
    amount: number
  }
}

type SavedLink = {
  path: string
  textContent: string
}

const DEFAULT_BREADCRUMB_CLASS_NAME = '.step-nav__last'
const LOCAL_STORAGE_KEY = 'payload-plugin-recently-visited-links'

const RecentlyVisited = ({ pluginOptions }: { pluginOptions: RecentlyVisitedPluginOptions }) => {
  const { user } = useAuth()
  const [lastLinks, setLastLinks] = useState<SavedLink[]>([])
  const [isOpen, setIsOpen] = useState(true)
  const recentlyVisitedPlugin = user?.recentlyVisitedPlugin as UserSettings['recentlyVisitedPlugin']
  const isRecentlyVisitedEnabled = recentlyVisitedPlugin?.enabled ?? true
  const maxVisitedLinks = recentlyVisitedPlugin?.amount ?? 4

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const getBreadcrumbLastText = async (): Promise<string | null> => {
    return new Promise(resolve => {
      let breadcrumbLastElement = document.querySelector(
        pluginOptions?.breadcrumbClass
          ? pluginOptions?.breadcrumbClass
          : DEFAULT_BREADCRUMB_CLASS_NAME,
      ) as HTMLElement
      if (!breadcrumbLastElement) {
        breadcrumbLastElement = document.querySelector('.app-header__step-nav') as HTMLElement
      }
      resolve(breadcrumbLastElement ? breadcrumbLastElement.textContent : null)
    })
  }

  const updateLastLinks = async (url: string) => {
    if (!isRecentlyVisitedEnabled) return

    const breadcrumbText = await getBreadcrumbLastText()
    const pathToSave = new URL(url).pathname
    const linkObject = { path: pathToSave, textContent: breadcrumbText || 'Link' }

    const savedLinks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
    const updatedLinks = [
      linkObject,
      ...savedLinks.filter((link: SavedLink) => link.path !== pathToSave),
    ].slice(0, maxVisitedLinks)

    if (JSON.stringify(updatedLinks) !== JSON.stringify(savedLinks)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLinks))
    }

    setLastLinks(updatedLinks)
  }

  useEffect(
    function observeBreadcrumb() {
      if (!isRecentlyVisitedEnabled) return
      const savedLinks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
      setLastLinks(savedLinks)
      const observer = new MutationObserver(async () => {
        await updateLastLinks(window.location.href)
      })
      const breadcrumbContainer = document.querySelector('.app-header__step-nav-wrapper')
      if (breadcrumbContainer) {
        observer.observe(breadcrumbContainer, {
          childList: true,
          subtree: true,
          characterData: true,
        })
      } else {
        console.error(
          '[PayloadPluginRecentlyVisited]: Breadcrumb container (`.app-header__step-nav-wrapper`) not found.',
        )
      }
      return () => {
        observer.disconnect()
      }
    },
    [isRecentlyVisitedEnabled],
  )

  if (!isRecentlyVisitedEnabled) return null

  return (
    <div
      className="nav-group RecentlyVisitedPluginNav nav-group--collapsed"
      id="nav-group-RecentlyVisitedPlugin"
    >
      <button
        onClick={toggleDropdown}
        className={`nav-group__toggle ${
          isOpen ? 'nav-group__toggle--open' : 'nav-group__toggle--collapsed'
        }`}
        type="button"
      >
        <div className="nav-group__label">Recently visited ({maxVisitedLinks})</div>
        <div className="nav-group__indicator">
          <svg
            style={{ transform: isOpen ? 'rotate(180deg)' : '' }}
            className="icon icon--chevron nav-group__indicator"
            viewBox="0 0 9 7"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <path className="stroke" d="M1.42871 1.5332L4.42707 4.96177L7.42543 1.5332"></path>
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="nav-group__content">
          {lastLinks.map((link: SavedLink, index: number) => (
            <Link
              href={link.path}
              className="nav__link"
              key={index}
              aria-label={link.textContent}
            >
              <span title={link.textContent}>{link.textContent}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentlyVisited
