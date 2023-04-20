import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { AiOutlineDelete, AiFillGithub } from "react-icons/ai";
import { BsChatSquareText } from "react-icons/bs";
import { useDateFormat } from "l-hooks";
import { v4 as uuidv4 } from "uuid";
import { useChannel, initChannelList } from "@/hooks";
import { Confirm } from "@/components";

const Menu: React.FC = () => {
  const { t } = useTranslation("menu");
  const { format } = useDateFormat();

  const [channel, setChannel] = useChannel();

  const stopPropagation = (e: any) => e.stopPropagation();

  const onAddChannel = () => {
    const channel_id = uuidv4();
    setChannel((channel) => {
      channel.list.push({
        channel_id,
        channel_name: "",
        chat_list: [],
      });
      channel.activeId = channel_id;
      return channel;
    });
  };

  const onChangeChannel = (id: string) => {
    if (id === channel.activeId) return;
    setChannel((channel) => {
      channel.activeId = id;
      return channel;
    });
  };

  const onDeleteChannel = (id: string) => {
    if (channel.list.length <= 1) {
      setChannel((channel) => {
        channel.list = initChannelList;
        channel.activeId = initChannelList[0].channel_id;
        return channel;
      });
    } else {
      setChannel((channel) => {
        channel.list = channel.list.filter((item) => item.channel_id !== id);
        if (id === channel.activeId) {
          channel.activeId = channel.list[0].channel_id;
        }
        return channel;
      });
    }
  };

  const onClearChannel = () => {
    setChannel((channel) => {
      channel.list = initChannelList;
      channel.activeId = initChannelList[0].channel_id;
      return channel;
    });
  };

  return (
    <div className="p-2 select-none hidden md:block md:w-[17.5rem] transition-colors dark:bg-[#232324]">
      <div
        onClick={onAddChannel}
        className={classNames(
          "rounded-lg text-white cursor-pointer flex h-12 mb-2 transition-all justify-center items-center",
          "bg-gradient-to-r from-cyan-500 to-blue-500 bg-magic-size hover:bg-magic-position"
        )}
      >
        {t("new-chat")}
      </div>
      <div className="h-pcMenu overflow-y-auto">
        {channel.list.map((item) => (
          <div
            key={item.channel_id}
            onClick={() => onChangeChannel(item.channel_id)}
            className={classNames(
              "rounded-lg cursor-pointer mb-1 overflow-hidden relative flex flex-col h-16 text-xs text-base-color px-[0.5rem] transition-colors gap-1 group justify-center",
              "hover:bg-menu-hover dark:hover:bg-color-fill-1",
              {
                "!bg-menu-active dark:!bg-slate-700":
                  item.channel_id === channel.activeId,
              }
            )}
          >
            <div className="flex justify-between items-center">
              <div className="font-medium text-sm text-ellipsis max-w-[26ch] pl-5 relative overflow-hidden whitespace-nowrap transition-colors dark:text-white">
                <BsChatSquareText className="top-[50%] left-0 translate-y-[-50%] absolute" />
                {item.channel_name || t("new-conversation")}
              </div>
            </div>
            <div
              className={classNames(
                "flex justify-between transition-all",
                "text-[#858b96] dark:text-neutral-500 dark:group-hover:text-neutral-400",
                {
                  "dark:!text-neutral-400":
                    item.channel_id === channel.activeId,
                }
              )}
            >
              <div>
                {item.chat_list.length} {t("messages")}
              </div>
              <div className="group-hover:opacity-0">
                {item.chat_list.length
                  ? item.chat_list.at(-1)?.time
                    ? format(
                        Number(item.chat_list.at(-1)?.time),
                        "MM-DD HH:mm:ss"
                      )
                    : ""
                  : ""}
              </div>
            </div>
            <Confirm
              title={t("delete-this-conversation")}
              content={t("delete-conversation")}
              trigger={
                <div
                  onClick={stopPropagation}
                  className="opacity-0 transition-all right-[-2rem] absolute dark:text-white group-hover:opacity-100 group-hover:right-2"
                >
                  <AiOutlineDelete size={20} />
                </div>
              }
              onOk={() => onDeleteChannel(item.channel_id)}
            />
          </div>
        ))}
      </div>
      <div className="h-[6.5rem] flex flex-col gap-2 border-t dark:border-neutral-600 pt-2">
        <Confirm
          title={t("clear-all-conversation")}
          content={t("clear-conversation")}
          trigger={
            <div className="h-11 rounded-md transition-colors text-sm hover:bg-menu-hover dark:hover:bg-color-fill-1 cursor-pointer flex items-center gap-2 px-2">
              <AiOutlineDelete size={16} /> {t("clear-all-conversation")}
            </div>
          }
          onOk={onClearChannel}
        />
        <a
          href="https://github.com/Peek-A-Booo/L-GPT"
          target="_blank"
          className="h-11 rounded-md transition-colors text-sm hover:bg-menu-hover dark:hover:bg-color-fill-1 cursor-pointer flex items-center gap-2 px-2"
        >
          <AiFillGithub size={16} /> Github
        </a>
      </div>
    </div>
  );
};

export default Menu;
