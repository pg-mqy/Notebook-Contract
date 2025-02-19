// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Notebook {
    address public owner;

    struct Note {
        string content;
        address author;
    }

    // 记录存储笔记
    mapping(uint256 => Note) private notes;
    // 记录地址是否已经写过笔记
    mapping(address => bool) public hasWritten;
    // 记录笔记数量，作为笔记的唯一 ID 生成器
    uint256 public noteCounter;

    // 通知区块链外部笔记的变化
    event NoteAdded(uint256 noteId, string content);
    event NoteUpdated(uint256 noteId, string newContent);
    event NoteDeleted(uint256 noteId);

    // 仅允许合约所有者执行
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // 名称
    function name() public pure returns (string memory)  {
        return "PG Notebook";
    }

    // 描述
    function description() public pure returns (string memory)  {
        return "This is a decentralized notepad";
    }

    // 添加笔记函数
    function addNote(string memory content) public {

        // 如果调用者不是所有者，则限制只能添加一条笔记
        if (msg.sender != owner) {
            require(!hasWritten[msg.sender], "Only one note allowed");
            hasWritten[msg.sender] = true;
        }
        notes[noteCounter] = Note(content, msg.sender);
        emit NoteAdded(noteCounter, content);
        noteCounter++;
    }

    // 更新笔记内容（owners）
    function updateNote(uint256 noteId, string memory newContent) public onlyOwner {
        require(bytes(notes[noteId].content).length > 0, "Note does not exist");
        notes[noteId].content = newContent;
        emit NoteUpdated(noteId, newContent);
    }

    // 删除笔记（owners）
    function deleteNote(uint256 noteId) public onlyOwner {
        require(bytes(notes[noteId].content).length > 0, "Note does not exist");
        delete notes[noteId];
        emit NoteDeleted(noteId);
    }

    // 获取单条笔记内容和作者地址
    function getNote(uint256 noteId) public view returns (string memory content, address author) {
        return (notes[noteId].content, notes[noteId].author);
    }

    // 获取所有现存的笔记
    function getAllNotes() public view returns (Note[] memory) {
        uint256 validCount = 0;

        // 计算现存的笔记数量
        for (uint256 i = 0; i < noteCounter; i++) {
            if (bytes(notes[i].content).length > 0) {
                validCount++;
            }
        }

        // 创建数组存储有效笔记
        Note[] memory validNotes = new Note[](validCount);
        uint256 index = 0;
        for (uint256 i = 0; i < noteCounter; i++) {
            if (bytes(notes[i].content).length > 0) {
                validNotes[index] = notes[i];
                index++;
            }
        }
        return validNotes;
    }
}