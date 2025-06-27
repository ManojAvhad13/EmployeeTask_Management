import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from 'react-icons/lu';

const AddAttachmentInput = ({ attachments, setAttachments }) => {

    const [option, setOption] = useState("");

    // Function to handle adding an option
    const handleAddOption = () => {
        if (option.trim()) {
            setAttachments([...attachments, option.trim()]);
            setOption("");
        }
    };

    // Function to handle delete an option

    const handleDeleteOption = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index);
        setTodoList(updatedArr);
    };

    return (
        <div>
            {attachments.map((item, index) => (
                <div
                    key={item}
                    className=''
                >
                    <div className="">
                        <LuPaperclip className='' />
                        <p className=''>{item}</p>
                    </div>

                    <button
                        className=''
                        onClick={() => {
                            handleDeleteOption(index);
                        }}
                    >
                        <HiOutlineTrash className='' />
                    </button>
                </div>
            ))}

            <div className="">
                <div className="">
                    <LuPaperclip className='' />

                    <input
                        type='text'
                        placeholder='Add File Link'
                        value={option}
                        onChange={({ target }) => setOption(target.value)}
                        className=''
                    />
                </div>
                <button className='' onClick={handleAddOption}>
                    <HiMiniPlus className='' /> Add
                </button>
            </div>

        </div>
    )
}

export default AddAttachmentInput
