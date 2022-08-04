import React, { memo, MouseEventHandler, useCallback, useContext, useMemo } from 'react';
import style from "./CardNFTArticle.module.scss";
import Image from "next/image";
import { NFTArticleInfos } from "../../types/entities/Article";
import { UserBadge } from "../User/UserBadge";
import { ipfsGatewayUrl } from "../../services/Ipfs";
import cs from "classnames";
import { SettingsContext } from "../../context/Theme";
import { format } from "date-fns";
import Link from 'next/link';
import { Tags } from '../Tags/Tags';

interface CardNftArticleProps {
  className?: string
  imagePriority?: boolean
  isDraft?: boolean
  article: NFTArticleInfos
  onDelete?: (id: string) => void
}

const _CardNftArticle = ({ 
  article: { 
    id,
    title,
    slug,
    thumbnailUri,
    description,
    tags,
    author,
    createdAt 
  },
  isDraft,
  imagePriority,
  onDelete,
  className 
}: CardNftArticleProps) => {
  const settings = useContext(SettingsContext)
  const thumbnailUrl = useMemo(() => thumbnailUri && ipfsGatewayUrl(thumbnailUri), [thumbnailUri])
  const dateCreatedAt = useMemo(() => new Date(createdAt), [createdAt]);
  const urlArticle = isDraft ? `/article/editor/local/${id}` : `/article/${slug}`;

  const onClickDelete = useCallback<MouseEventHandler>((event) => {
    event.preventDefault()
    event.stopPropagation()
    if (window.confirm?.("Do you really want to delete this article ? It will be removed from your browser memory.")) {
      onDelete?.(id as string)
    }
  }, [])

  return (
    <div className={cs(style.container, className, {
      [style.hover_effect]: settings.hoverEffectCard,
      [style.draft_container]: isDraft,
    })}>
      <Link href={urlArticle}>
        <a className={cs(style.link_wrapper)}/>
      </Link>
      {isDraft && (
        <div className={style.draft_banner}>
          <span>DRAFT (saved locally)</span>
          <button
            type="button"
            onClick={onClickDelete}
          >
            <i className="fa-solid fa-trash" aria-hidden/>
          </button>
        </div>
      )}
      <div className={style.content}>
        <div className={cs(style['img-wrapper'], {
          [style['draft_img-wrapper']]: isDraft,
        })}>
          {thumbnailUrl &&
            <Image
              src={thumbnailUrl}
              layout="fill"
              objectFit="cover"
              objectPosition="top"
              priority={imagePriority}
            />
          }
        </div>
        <div className={style.infos}>
          {!isDraft &&
            <div className={style.infos_header}>
              <UserBadge
                hasLink
                user={author!}
                size="regular"
                className={cs(style.author)}
              />
              <div className={style.date}>
                <time dateTime={format(dateCreatedAt, 'yyyy/MM/dd')}>
                  {format(dateCreatedAt, 'MMMM d, yyyy')}
                </time>
              </div>
            </div>
          }
          <Link href={urlArticle}>
            <a className={style.title}>
              <h4>{title}</h4>
            </a>
          </Link>
          <div className={style.description}>
            <p>
              {description}
            </p>
          </div>
          <Tags tags={tags}/>
        </div>
      </div>
    </div>
  );
};

export const CardNftArticle = memo(_CardNftArticle);
