import React from "react";

export default function Buttons({ btnName, onClick, type = "primary" }) {
  if (type == "primary") {
    return (
      <button
        onClick={onClick}
        type="button"
        class="px-3 py-1 text-sm font-medium text-center font-mono text-white rounded-sm bg-blue-500 hover:bg-blue-400"
      >
        {btnName}
      </button>
    );
  } else if (type == "warning") {
    return (
      <button
        onClick={onClick}
        type="button"
        class="px-3 py-1 text-sm font-medium text-center font-mono text-white rounded-sm bg-amber-500 hover:bg-amber-400"
      >
        {btnName}
      </button>
    );
  } else if (type == "danger") {
    return (
      <button
        onClick={onClick}
        type="button"
        class="px-3 py-1 text-sm font-medium text-center font-mono text-white rounded-sm bg-red-500 hover:bg-red-400"
      >
        {btnName}
      </button>
    );
  } else if (type == "success") {
    return (
      <button
        onClick={onClick}
        type="button"
        class="px-3 py-1 text-sm font-medium text-center font-mono text-white rounded-sm bg-emerald-500 hover:bg-emerald-400"
      >
        {btnName}
      </button>
    );
  }
}
