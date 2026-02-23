/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/blog/comments-section.tsx
"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/app/components/ui/avatar"
import { Button } from "@/src/app/components/ui/button"
import { Textarea } from "@/src/app/components/ui/textarea"
import { Card, CardContent } from "@/src/app/components/ui/card"
import { ThumbsUp, Reply, MoreHorizontal, Flag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/app/components/ui/dropdown-menu"
import { useToast } from "../../hooks/use-toast"

interface Comment {
  id: string
  author: {
    name: string
    avatar?: string
  }
  content: string
  createdAt: string
  likes: number
  replies?: Comment[]
}

interface CommentsSectionProps {
  postId: string
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: {
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
      },
      content: "Great article! Really helped me understand the concept better.",
      createdAt: "2 hours ago",
      likes: 12,
      replies: [
        {
          id: "2",
          author: {
            name: "Jane Smith",
          },
          content: "I agree! Very well written.",
          createdAt: "1 hour ago",
          likes: 5,
        },
      ],
    },
    {
      id: "3",
      author: {
        name: "Mike Johnson",
      },
      content: "Thanks for sharing this. Looking forward to more content like this.",
      createdAt: "3 hours ago",
      likes: 8,
    },
  ])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "Current User", // This would come from auth
      },
      content: newComment,
      createdAt: "Just now",
      likes: 0,
    }

    if (replyingTo) {
      // Add reply logic
      setComments(prev => 
        prev.map(c => 
          c.id === replyingTo 
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        )
      )
      setReplyingTo(null)
    } else {
      setComments(prev => [comment, ...prev])
    }

    setNewComment("")
    toast({
      title: "Comment posted",
      description: "Your comment has been posted successfully.",
    })
  }

  const handleLikeComment = (commentId: string) => {
    toast({
      title: "Liked!",
      description: "You liked this comment.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Add Comment */}
      <Card>
        <CardContent className="p-4">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {replyingTo && "Replying to a comment"}
            </p>
            <div className="space-x-2">
              {replyingTo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>
                        {comment.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleLikeComment(comment.id)}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-12 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {reply.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {reply.author.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {reply.createdAt}
                            </span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}