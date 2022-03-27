import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:mobileapp/screens/settings/notifications/bloc/notifications_bloc.dart';
import 'package:mobileapp/screens/settings/widgets/selector.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';
import 'package:mobileapp/screens/shared_widgets/toast.dart';
import 'package:notifications_repository/notifications_repository.dart';

class NotificationsSection extends StatelessWidget {
  const NotificationsSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    //TODO: fix error showing
    // context
    //     .read<NotificationsBloc>()
    //     .stream
    //     .every((state) => state.status.isError)
    //     .then((_) => showAlertToast("Couldn’t save notification preference"));
    return SidePadding(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _title,
          const _Selectors(),
          //TODO: fix error showing
          BlocListener<NotificationsBloc, NotificationsState>(
            listener: (context, state) {
              print(state);
              if (state.status.isError) {
                showAlertToast("Couldn’t save notification preference");
              }
            },
            child: Container(),
          ),
        ],
      ),
    );
  }

  Widget get _title => Padding(
        padding: EdgeInsets.only(bottom: 20.w),
        child: Text(
          "Notifications",
          style: TextStyle(
            fontFamily: AppFonts.londrina,
            fontSize: 36.sp,
            color: AppColors.textColor,
          ),
        ),
      );
}

class _Selectors extends StatelessWidget {
  const _Selectors({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        BlocBuilder<NotificationsBloc, NotificationsState>(
          buildWhen: (previousState, state) {
            if (previousState.status.isInitial ||
                previousState.status.isError) {
              return true;
            }

            if (previousState.onAuctionEnd != state.onAuctionEnd) {
              return true;
            } else {
              return false;
            }
          },
          builder: (context, state) {
            return Selector(
              type: NotificationTopics.onAuctionEnd.name,
              text: "On auction end",
              value: state.onAuctionEnd,
              onChange: (newValue) {
                context
                    .read<NotificationsBloc>()
                    .add(NotificationsTopicStateChanged(
                      topic: NotificationTopics.onAuctionEnd,
                      value: newValue,
                    ));
              },
            );
          },
        ),
        SizedBox(height: 10.h),
        BlocBuilder<NotificationsBloc, NotificationsState>(
          buildWhen: (previousState, state) {
            if (previousState.status.isInitial) return true;

            if (previousState.fiveMinutesBeforeEnd !=
                state.fiveMinutesBeforeEnd) {
              return true;
            } else {
              return false;
            }
          },
          builder: (context, state) {
            if (state.status.isSuccess || state.status.isInitial) {
              return Selector(
                type: NotificationTopics.fiveMinutesBeforeEnd.name,
                text: "5 min before end",
                value: state.fiveMinutesBeforeEnd,
                onChange: (newValue) {
                  context
                      .read<NotificationsBloc>()
                      .add(NotificationsTopicStateChanged(
                        topic: NotificationTopics.fiveMinutesBeforeEnd,
                        value: newValue,
                      ));
                },
              );
            }
            return const Text("Error loading the data");
          },
        ),
        SizedBox(height: 10.h),
        BlocBuilder<NotificationsBloc, NotificationsState>(
          buildWhen: (previousState, state) {
            if (previousState.status.isInitial) return true;

            if (previousState.tenMinutesBeforeEnd !=
                state.tenMinutesBeforeEnd) {
              return true;
            } else {
              return false;
            }
          },
          builder: (context, state) {
            if (state.status.isSuccess || state.status.isInitial) {
              return Selector(
                type: NotificationTopics.tenMinutesBeforeEnd.name,
                text: "10 min before end",
                value: state.tenMinutesBeforeEnd,
                onChange: (newValue) {
                  context
                      .read<NotificationsBloc>()
                      .add(NotificationsTopicStateChanged(
                        topic: NotificationTopics.tenMinutesBeforeEnd,
                        value: newValue,
                      ));
                },
              );
            }
            return const Text("Error loading the data");
          },
        ),
      ],
    );
  }
}
