import type {
  PublishPostInput,
  AddPostToSeriesInput,
  UpdatePostInput,
  RemovePostInput,
  LikePostInput,
  LikePostPayload,
  RemovePostPayload,
  UpdatePostPayload,
  AddPostToSeriesPayload,
  PublishPostPayload,
  LikeCommentInput,
  LikeCommentPayload,
  LikeReplyInput,
  LikeReplyPayload,
  AddCommentInput,
  AddCommentPayload,
  UpdateCommentInput,
  UpdateCommentPayload,
  RemoveCommentInput,
  RemoveCommentPayload,
  AddReplyInput,
  AddReplyPayload,
  UpdateReplyInput,
  UpdateReplyPayload,
  RemoveReplyInput,
  RemoveReplyPayload,
} from './../../generated/gqlQueryTypes';
import type { HashnodeSDKClient } from '../../client';
import { BaseManager } from '../base.manager';
import {
  type Draft,
  type FeedFilter,
  type FeedPostConnection,
  type Post,
  PostCommenterSortBy,
  PostCommentSortBy,
  type PostLikerFilter,
} from '../../generated/gqlQueryTypes';
import {
  ADD_COMMENT_MUTATION,
  ADD_POST_TO_SERIES_MUTATION,
  ADD_REPLY_MUTATION,
  GET_DRAFT_POST_QUERY,
  GET_FEED_POST,
  GET_POST_COMMENTERS,
  GET_POST_COMMENTS,
  GET_POST_LIKERS,
  GET_POST_PUBLICATION_QUERY,
  GET_POST_QUERY,
  GET_SCHEDULED_POST_QUERY,
  LIKE_COMMENT_MUTATION,
  LIKE_POST_MUTATION,
  LIKE_REPLY_MUTATION,
  PUBLISH_POST_MUTATION,
  REMOVE_COMMENT_MUTATION,
  REMOVE_POST_MUTATION,
  REMOVE_REPLY_MUTATION,
  UPDATE_COMMENT_MUTATION,
  UPDATE_POST_MUTATION,
  UPDATE_REPLY_MUTATION,
} from './post.queries';

/**
 * A manager class for handling post-related operations via the Hashnode SDK.
 * Extends the BaseManager class to provide post-specific functionality.
 *
 * @extends BaseManager
 */
export class PostManager extends BaseManager {
  /**
   * Creates an instance of PostManager.
   * @param client - The HashnodeSDKClient instance.
   */
  constructor(client: HashnodeSDKClient) {
    super(client, 'PostManager');
  }

  /**
   * Retrieves a post by its ID.
   *
   * @param postId - The ID of the post.
   *
   * @returns A promise that resolves to the post.
   */
  async getPost(postId: string) {
    const res = await this.makeRequest<{ post: Post }>(
      'getPost',
      GET_POST_QUERY,
      { postId },
    );
    return res.post;
  }

  /**
   * Retrieves the publication of a post.
   *
   * @param postId - The ID of the post.
   *
   * @returns A promise that resolves to the publication of the post.
   */
  async getPostPublication(postId: string) {
    const res = await this.makeRequest<{ post: Post }>(
      'getPostPublication',
      GET_POST_PUBLICATION_QUERY,
      { postId },
    );
    return res.post.publication;
  }

  /**
   * Retrieves comments for a specific post
   *
   * @param postId - The unique identifier of the post
   * @param first - The number of comments to retrieve
   * @param after - Cursor for pagination
   * @param sortBy - Sort criteria for the comments
   *
   * @returns Promise containing an array of comments for the specified post
   */
  async getPostComments(
    postId: string,
    first: number,
    after: string,
    sortBy: PostCommentSortBy,
  ) {
    const res = await this.makeRequest<{ post: Post }>(
      'getPostComments',
      GET_POST_COMMENTS,
      { postId, first, after, sortBy },
    );
    return res.post.comments;
  }

  /**
   * Retrieves commenters for a specific post with pagination and sorting options.
   *
   * @param postId - The unique identifier of the post to get commenters from
   * @param first - The number of commenters to retrieve in one request
   * @param after - The cursor for pagination, representing the position after which to fetch commenters
   * @param sortBy - The sorting criteria for the commenters list
   *
   * @returns A Promise that resolves to an array of commenters for the specified post
   */
  async getPostCommenters(
    postId: string,
    first: number,
    after: string,
    sortBy: PostCommenterSortBy,
  ) {
    const res = await this.makeRequest<{ post: Post }>(
      'getPostCommenters',
      GET_POST_COMMENTERS,
      { postId, first, after, sortBy },
    );
    return res.post.commenters;
  }

  /**
   * Retrieves users who have liked a specific post
   *
   * @param postId - The unique identifier of the post
   * @param first - The number of likers to return
   * @param after - Cursor for pagination, specifying where to start fetching likers
   * @param filter - Filter criteria for post likers
   *
   * @returns Promise containing an array of users who liked the post
   */
  async getPostLikers(
    postId: string,
    first: number,
    after: string,
    filter: PostLikerFilter,
  ) {
    const res = await this.makeRequest<{ post: Post }>(
      'getPostLikers',
      GET_POST_LIKERS,
      { postId, first, after, filter },
    );
    return res.post.likedBy;
  }

  /**
   * Retrieves a draft post
   *
   * @param draftID - The draft ID of the draft post
   *
   * @return The draft post
   */
  async getDraftPostQuery(draftID: string) {
    const res = await this.makeRequest<{ draft: Draft }>(
      'getDraftPostQuery',
      GET_DRAFT_POST_QUERY,
      { id: draftID },
    );
    return res.draft;
  }

  /**
   * Retrieves a scheduled post
   *
   * @param scheduledPostID - The ID of the scheduled post
   *
   * @return The scheduled post
   */
  async getScheduledPost(scheduledPostID: string) {
    const res = await this.makeRequest<{ post: Post }>(
      'getScheduledPost',
      GET_SCHEDULED_POST_QUERY,
      { id: scheduledPostID },
    );
    return res.post;
  }

  /**
   * Retrieves feed posts based on specified parameters
   *
   * @param first - The number of posts to retrieve
   * @param after - Cursor for pagination, representing the ID after which to fetch posts
   * @param filter - Filter criteria for the feed posts
   *
   * @returns Promise resolving to a FeedPostConnection object containing the feed posts
   */
  async getFeedPosts(first: number, after: string, filter: FeedFilter) {
    const res = await this.makeRequest<{ feedPost: FeedPostConnection }>(
      'getFeedPosts',
      GET_FEED_POST,
      {
        first,
        after,
        filter,
      },
    );
    return res.feedPost;
  }

  // =======================MUTATIONS=======================

  /**
   * Publish a post
   *
   * @param {PublishPostInput} input - The post to be published
   *
   * @returns The new post
   */
  async publishPost(input: PublishPostInput) {
    const res = await this.makeRequest<{ publishedpost: PublishPostPayload }>(
      'publishPost',
      PUBLISH_POST_MUTATION,
      {
        input,
      },
    );
    return res.publishedpost.post;
  }

  /**
   * Add a post to a series
   *
   * @param {AddPostToSeriesInput} input - The input of the post to be added to the series
   *
   * @return The series
   */
  async addPostToSeries(input: AddPostToSeriesInput) {
    const res = await this.makeRequest<{ series: AddPostToSeriesPayload }>(
      'addPostToSeries',
      ADD_POST_TO_SERIES_MUTATION,
      {
        input,
      },
    );
    return res.series;
  }

  /**
   * Updates a post
   *
   * @param {UpdatePostInput} input - The input of the post to be updated
   *
   * @return The updated post
   */
  async updatePost(input: UpdatePostInput) {
    const res = await this.makeRequest<{ updatedPost: UpdatePostPayload }>(
      'updatePost',
      UPDATE_POST_MUTATION,
      {
        input,
      },
    );
    return res.updatedPost;
  }

  /**
   * Remove a post
   *
   * @param {RemovePostInput} input - The input of the post to be removed
   *
   * @return The removed post
   */
  async removePost(input: RemovePostInput) {
    const res = await this.makeRequest<{ removedPost: RemovePostPayload }>(
      'removePost',
      REMOVE_POST_MUTATION,
      {
        input,
      },
    );
    return res.removedPost;
  }

  /**
   * Like a post
   *
   * @param {LikePostInput} input - The input of the post to be liked
   *
   * @return The liked post
   */
  async likePost(input: LikePostInput) {
    const res = await this.makeRequest<{ likedPost: LikePostPayload }>(
      'likePost',
      LIKE_POST_MUTATION,
      {
        input,
      },
    );
    return res.likedPost;
  }

  /**
   * Like a comment
   *
   * @param {LikeCommentInput} input -  The like comment input
   *
   * @returns - The liked comment
   */
  async likeComment(input: LikeCommentInput) {
    const res = await this.makeRequest<{ likedComment: LikeCommentPayload }>(
      'likeComment',
      LIKE_COMMENT_MUTATION,
      {
        input,
      },
    );
    return res.likedComment.comment;
  }

  /**
   * Like a comment
   *
   * @param {LikeCommentInput} input -  The like comment input
   *
   * @returns - The liked comment
   */
  async likeReply(input: LikeReplyInput) {
    const res = await this.makeRequest<{ likedReply: LikeReplyPayload }>(
      'likeReply',
      LIKE_REPLY_MUTATION,
      {
        input,
      },
    );
    return res.likedReply.reply;
  }

  /**
   * Add a comment
   *
   * @param {AddCommentInput} input -  The add comment input
   *
   * @returns - The added comment
   */
  async addComment(input: AddCommentInput) {
    const res = await this.makeRequest<{ addedComment: AddCommentPayload }>(
      'addComment',
      ADD_COMMENT_MUTATION,
      {
        input,
      },
    );
    return res.addedComment.comment;
  }

  /**
   * Update a comment
   *
   * @param {UpdateCommentInput} input -  The update comment input
   *
   * @returns - The updated comment
   */
  async updateComment(input: UpdateCommentInput) {
    const res = await this.makeRequest<{
      updatedComment: UpdateCommentPayload;
    }>('updateComment', UPDATE_COMMENT_MUTATION, {
      input,
    });
    return res.updatedComment.comment;
  }

  /**
   * Remove a comment
   *
   * @param {RemoveCommentInput} input -  The remove comment input
   *
   * @returns - The removed comment
   */
  async removeComment(input: RemoveCommentInput) {
    const res = await this.makeRequest<{
      removedComment: RemoveCommentPayload;
    }>('removeComment', REMOVE_COMMENT_MUTATION, {
      input,
    });
    return res.removedComment.comment;
  }

  /**
   * Add a reply
   *
   * @param {AddReplyInput} input -  The add reply input
   *
   * @returns - The added reply
   */
  async addReply(input: AddReplyInput) {
    const res = await this.makeRequest<{ addedReply: AddReplyPayload }>(
      'addReply',
      ADD_REPLY_MUTATION,
      {
        input,
      },
    );
    return res.addedReply.reply;
  }

  /**
   * Updated a reply
   *
   * @param {UpdateReplyInput} input -  The update reply input
   *
   * @returns - The updated reply
   */
  async updateReply(input: UpdateReplyInput) {
    const res = await this.makeRequest<{ updatedReply: UpdateReplyPayload }>(
      'updateReply',
      UPDATE_REPLY_MUTATION,
      {
        input,
      },
    );
    return res.updatedReply.reply;
  }

  /**
   * Removed a reply
   *
   * @param {UpdateReplyInput} input -  The remove reply input
   *
   * @returns - The removed reply
   */
  async removeReply(input: RemoveReplyInput) {
    const res = await this.makeRequest<{ removedReply: RemoveReplyPayload }>(
      'removeReply',
      REMOVE_REPLY_MUTATION,
      {
        input,
      },
    );
    return res.removedReply.reply;
  }
}
