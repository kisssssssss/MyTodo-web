import type { StateCreator } from "zustand";

export type TodoBaseType = {
  id: string;
  title: string;
  time: string;
  content: string;
  tags: string[];
  isCloudSynced: boolean;
  isSelected: boolean;
  uid: string;
};

export type TempTodoType = Pick<TodoBaseType, "title" | "time" | "content" | "tags" | "id">;

export type TodoItemType = Omit<TodoBaseType, "content">;

export type TagType = {
  id: string; 
  // 列显示的名称，tag
  title: string;
  // 简要描述该列功能
  description?: string;
  // 是否隐藏该列
  isHidden: boolean;
  // 图标
  icon: string;
};

export type DataSlice = {
  todos: TodoItemType[];

  /**
   * @description tag 即是看板也是标签，一个标签对应一个看板
   * */
  tags: TagType[];

  /**
   * @description 保存 todo 到 todos，并保存 content 到 indexDB
   * @returns 如果保存成功则返回 id，否则返回 null
   * */
  save_todo: (value: Omit<TempTodoType, "id">) => Promise<string | null>;

  /**
   * @description 根据 id 删除 todo
   * */
  delete_todo: (id: string[]) => Promise<boolean>;

  /**
   * @description 根据 id 更新单个 todo
   * */
  update_todo: (id: string, value: Partial<Omit<TodoBaseType, "id" | "uid">>) => Promise<boolean>;

  /**
   * @description 将 todos 更新为 fn 的返回值
   * */
  update_todos: (fn: (todos: TodoItemType[]) => TodoItemType[]) => void;

  /**
   * @description 调换 todos 中两个 todo 的顺序
   * @param index 两个 todo 的索引, [sourceIndex, destinationIndex] | [sourceId, destinationId]
   * */
  reorder_todos: (index: [string, string] | [number, number]) => void;

  /**
   * @description 获取 todos 中的某个 todo 的详细信息
   * @param index 两个 todo 的索引, [sourceIndex, destinationIndex] | [sourceId, destinationId]
   * */
  get_todo: (id: string) => Promise<TodoBaseType | null>;

  // ================== 仅用于 /todo 页面 ==================

  tempTodo: TempTodoType;

  /**
   * @description 将 todos 更新为 fn 的返回值
   * */
  update_tempTodo: (value: Partial<TempTodoType>) => void;

  /**
   * @description 更改当前显示（标题，时间，编辑器）内容为传入id 的 todo 的内容
   * */
  change_tempTodo: (id: string) => void;

  /**
   * @description 保存当前 tempTodo
   * */
  save_tempTodo: () => Promise<{ status: boolean; msg: string }>;

  /**
   * @description 创建一个临时 todo（保存当前 tempTodo, 并重置显示内容）
   * */
  create_tempTodo: () => Promise<{ status: boolean; msg: string }>;

  /**
   * @description 对显示的 todo 列表进行全选或全不选
   * */
  toggle_AllTodoSelected: (status: boolean) => void;

  /**
   * @description 删除选中的 todo
   * */
  delete_selectedTodo: () => Promise<{ status: boolean; msg: string }>;

  /**
   * @description 重置显示内容
   * */
  reset_tempTodo: () => void;

  // ================== 仅用于 /board 页面 ==================

  /**
   * @description 重新排列看板的顺序
   * */
  reorder_tags: (sourceIndex: number, destinationIndex: number) => void;

  /**
   * @description 在看板界面创建 todo
   * */
  save_item: (value: Pick<TempTodoType, "tags" | "title">) => void;
};

export type UserSlice = {
  isLogin: boolean;

  user: {
    uid: string;
    name: string;
    token: string;
    account: string;
    isGuest?: boolean;
  };

  settings: Partial<{
    isCloudSyncEnabled: boolean;
  }>;

  login: () => void;

  loginAsGuest: () => void;

  quit: () => void;
};

export type StoreType = DataSlice & UserSlice;

export type StateTypeWithImmer<T> = StateCreator<StoreType, [["zustand/immer", never]], [], T>;

export type DataStateType = StateTypeWithImmer<DataSlice>;

export type UserStateType = StateTypeWithImmer<UserSlice>;
