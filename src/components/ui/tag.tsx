import { memo, useEffect, useState } from "react";
import { Button, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { TagType, useStore } from "@/store";
import type { Selection } from "@nextui-org/react";
import type OverlayPlacement from "@nextui-org/aria-utils";

import AddIcon from "@/assets/svg/add.svg?react";
import FilterIcon from "@/assets/svg/filter.svg?react";

export const TagCircle = memo<{ color?: string; className?: string }>(({ color, className }) => {
  return (
    <div
      className={cn(
        "size-4 flex-shrink-0 flex-grow-0 rounded-full border-2 border-solid transition-colors",
        color,
        className,
      )}
    />
  );
});

export const Tag = memo<{
  tag: Partial<Pick<TagType, "title" | "color">>;
  classNames?: { base?: string; icon?: string; text?: string };
}>(({ tag, classNames }) => {
  return (
    <div
      className={cn(
        "flex w-fit min-w-fit select-none items-center gap-2 rounded-full border border-default-200 bg-default-100/50 px-2 py-1 transition-colors dark:border-default-100",
        classNames?.base,
      )}
    >
      <TagCircle color={tag.color} className={classNames?.icon} />
      <span className={cn("text-xs text-default-500 dark:text-default-500/80", classNames?.text)}>{tag.title}</span>
    </div>
  );
});

export const TagFilter = memo<{ onAction: (key: TagType["id"]) => void }>(({ onAction }) => {
  const tags = useStore((state) => state.tags);

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  return (
    <Dropdown classNames={{ content: "min-w-fit" }}>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <FilterIcon className="size-4 fill-default-800/80 dark:fill-default-400/80" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          setSelectedKeys(keys);
          onAction(Array.from(keys)[0] as string);
        }}
      >
        {tags.map((tag) => (
          <DropdownItem key={tag.id} title={tag.title} startContent={<TagCircle color={tag.color} />} />
        ))}
      </DropdownMenu>
    </Dropdown>
  );
});

export const TagSelector = memo<{
  placement?: OverlayPlacement.OverlayPlacement;
  showDescription?: boolean;
  tagId?: TagType["id"];
  onAction: (key: TagType["id"]) => void;
}>(({ placement, showDescription, tagId, onAction }) => {
  // 不显示 noTag 标签
  const tags = useStore((state) => state.tags).filter((item) => item.id !== "NoTag");

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([tagId || ""]));
  useEffect(() => {
    setSelectedKeys(new Set([tagId || ""]));
  }, [tagId]);

  const TagButton = tags.find((item) => item.id === tagId);

  return (
    <Dropdown placement={placement}>
      <DropdownTrigger>
        <button className="outline-none">
          {TagButton ? (
            <Tag tag={TagButton} />
          ) : (
            <div className="rounded-full border-2 border-default-200 p-[2px]">
              <AddIcon className="size-5 fill-default-400" />
            </div>
          )}
        </button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          setSelectedKeys(keys);
          onAction(Array.from(keys)[0] as string);
        }}
      >
        {tags.map((tag) => (
          <DropdownItem
            key={tag.id}
            title={tag.title}
            description={showDescription ? tag.description : ""}
            startContent={<TagCircle color={tag.color} />}
            classNames={{ description: "text-xs !text-default-400" }}
          />
        ))}
      </DropdownMenu>
    </Dropdown>
  );
});

export default Tag;
